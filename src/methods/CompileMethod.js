const Resolver = require('../Resolver');
const { ScriptCollection } = require('../Modules');
const { stringifyJSON, hmrFile } = require('../Utils');

/**
 * Compile into template function and export a JS module.
 */
class CompileMethod {
  constructor({ templateFile, templateName, esModule }) {
    this.templateFile = templateFile;
    this.templateName = templateName;
    this.exportCode = esModule ? 'export default ' : 'module.exports=';
  }

  /**
   * Returns the string as require() with interpolated value for a resource file.
   *
   * @param {string} value The required file.
   * @param {string} issuer The issuer of required file.
   * @return {string}
   */
  require(value, issuer) {
    const interpolatedValue = Resolver.interpolate(value, issuer);

    return `require(${interpolatedValue})`;
  }

  /**
   * Returns the string as require() with interpolated value for the script file.
   * The filename from the script tag will be stored for usage in pug-plugin.
   *
   * @param {string} value The required file.
   * @param {string} issuer The issuer of required file.
   * @return {string}
   */
  requireScript(value, issuer) {
    const resolvedFile = Resolver.interpolate(value, issuer, 'script');
    ScriptCollection.add(resolvedFile, this.templateFile);

    return `require('${resolvedFile}')`;
  }

  /**
   * Returns the string as require() with interpolated value for the style file.
   *
   * @param {string} value The required file.
   * @param {string} issuer The issuer of required file.
   * @return {string}
   */
  requireStyle(value, issuer) {
    const resolvedFile = Resolver.interpolate(value, issuer, 'style');

    return `require('${resolvedFile}')`;
  }

  /**
   * Export the compiled template function contained resolved source asset files.
   * Note: the export is required for `compile` mode.
   *
   * @param {string} templateFunction The source code of the template function.
   * @param {{}} data The object with external variables passed in template from data option.
   * @return {string} The exported template function.
   */
  export(templateFunction,  data ) {
    const functionName = this.templateName;
    const exportFunctionName = 'exportFn';

    if (!Object.keys(data).length) {
      return `${templateFunction};${this.exportCode}${functionName};`;
    }

    return `${templateFunction};
        var data = ${stringifyJSON(data)};
        var ${exportFunctionName} = (context) => ${functionName}(Object.assign(data, context));
        ${this.exportCode}${exportFunctionName};`;
  }

  /**
   * Export code with error message.
   *
   * @param {Error} error
   * @param {Function} getErrorMessage
   * @param {string} issuer
   * @return {string}
   */
  exportError(error, getErrorMessage, issuer) {
    const requireHmrScript = `' + require('${hmrFile}') + '`;
    const errStr = error.toString().replace(/'/g, "\\'");
    const message = getErrorMessage.call(null, errStr, requireHmrScript);
    ScriptCollection.add(hmrFile, this.templateFile);

    return this.exportCode + `() => '${message}';`;
  }
}

module.exports = CompileMethod;
