const Resolver = require('../Resolver');
const { ScriptCollection } = require('../Modules');
const { injectExternalData, hmrFile } = require('../Utils');

/**
 * Compile into template function and export a JS module.
 */
class CompileMethod {
  constructor({ templateFile, templateName, esModule, useSelf }) {
    this.useSelf = useSelf;
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
   * Export template code for using at runtime.
   *
   * @param {string} source The template source code.
   * @param {{}} locals The variables passed in template function.
   * @return {string}
   */
  export(source, locals) {
    if (Object.keys(locals).length > 0) {
      source = injectExternalData(source, locals, this.useSelf);
    }
    return source + ';' + this.exportCode + this.templateName + ';';
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
