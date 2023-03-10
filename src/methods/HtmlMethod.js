const VMScript = require('../VMScript');
const Resolver = require('../Resolver');
const { ScriptCollection } = require('../Modules');
const { isRequireableScript, hmrFile } = require('../Utils');

/**
 * Render into HTML and return the pure string.
 *
 * This method require an additional loader, like `html-loader`, to handle the HTML string.
 * The require() function for resources must be omitted to allow handle the `src` in `html-loader`.
 */
class HtmlMethod {
  constructor({ templateFile, templateName, esModule }) {
    const loaderRequire = this.loaderRequire.bind(this);
    const loaderRequireScript = this.loaderRequireScript.bind(this);
    const loaderRequireStyle = this.loaderRequireStyle.bind(this);

    this.templateFile = templateFile;
    this.vmscript = new VMScript({
      templateName,
      loaderRequire,
      loaderRequireScript,
      loaderRequireStyle,
    });
  }

  /**
   * Encode reserved HTML chars.
   *
   * @param {string} str
   * @return {string}
   */
  encodeReservedChars(str) {
    if (str.indexOf('?') < 0) return str;

    return str.replace(/&/g, '\\u0026');
  }

  /**
   * Decode reserved HTML chars.
   *
   * @param {string} str
   * @return {string}
   */
  decodeReservedChars(str) {
    return str.replace(/\\u0026/g, '&');
  }

  /**
   * Resolve resource file after compilation of source code.
   * At this stage the filename is interpolated in VM.
   *
   * @param {string} file The required file.
   * @param {string} issuer The issuer of required file.
   * @return {string}
   */
  loaderRequire(file, issuer) {
    const resolvedFile = Resolver.resolve(file, issuer);

    if (isRequireableScript(resolvedFile)) return require(resolvedFile);

    return this.encodeReservedChars(resolvedFile);
  }

  /**
   * Resolve script file after compilation of source code.
   *
   * @param {string} file The required file.
   * @param {string} issuer The template file.
   * @return {string}
   */
  loaderRequireScript(file, issuer) {
    let resolvedFile = Resolver.resolve(file, issuer, 'script');
    ScriptCollection.add(resolvedFile, this.templateFile);

    return resolvedFile;
  }

  /**
   * Resolve style file after compilation of source code.
   *
   * @param {string} file The required file.
   * @param {string} issuer The issuer of required file.
   * @return {string}
   */
  loaderRequireStyle(file, issuer) {
    return Resolver.resolve(file, issuer, 'style');
  }

  /**
   * Returns the expression with the name of the handler function in the template source code,
   * which will be called when this template is compiled in the VM.
   *
   * @param {string} file The required file.
   * @param {string} issuer The issuer of required file.
   * @return {string}
   */
  require(file, issuer) {
    return this.vmscript.require(file, issuer);
  }

  /**
   * Returns the expression with the name of the handler function in the template source code,
   * which will be called when this template is compiled in the VM.
   * The filename from the script tag will be stored for usage in pug-plugin.
   *
   * @param {string} file The required file.
   * @param {string} issuer The issuer of required file.
   * @return {string}
   */
  requireScript(file, issuer) {
    return this.vmscript.require(file, issuer, 'script');
  }

  /**
   * Returns the expression with the name of the handler function in the template source code,
   * which will be called when this template is compiled in the VM.
   *
   * @param {string} file The required file.
   * @param {string} issuer The issuer of required file.
   * @return {string}
   */
  requireStyle(file, issuer) {
    return this.vmscript.require(file, issuer, 'style');
  }

  /**
   * Export rendered HTML string.
   *
   * @param {string} source The template source code.
   * @param {{}} locals The variables passed in template function.
   * @return {string}
   */
  export(source, locals) {
    const result = this.vmscript.run(this.templateFile, source, locals);

    return this.decodeReservedChars(result);
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
    ScriptCollection.add(hmrFile, this.templateFile);
    return getErrorMessage.call(null, error.toString(), hmrFile);
  }
}

module.exports = HtmlMethod;
