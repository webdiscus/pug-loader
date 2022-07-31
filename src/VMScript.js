const vm = require('vm');
const dependency = require('./Dependency');
const { executeTemplateFunctionException } = require('./Exeptions');

class VMScript {
  requireHandlerName = '__PUG_LOADER_REQUIRE__';
  requireScriptHandlerName = '__PUG_LOADER_REQUIRE_SCRIPT__';

  /**
   * @param {string} templateName The template filename.
   * @param {Function} loaderRequire The method function for resolving a resource file in template.
   * @param {Function} loaderRequireScript The method function for resolving a script file in template.
   */
  constructor({ templateName, loaderRequire, loaderRequireScript }) {
    const contextOptions = { require };
    contextOptions[this.requireHandlerName] = loaderRequire;
    contextOptions[this.requireScriptHandlerName] = loaderRequireScript;

    this.contextObject = vm.createContext(contextOptions);
    this.templateName = templateName;
  }

  /**
   * Return template of require function to call custom handler in vm depend on the method.
   *
   * @param {string} file The argument of require function.
   * @param {string} issuer The issuer of file.
   * @param {boolean} isScript Whether require argument if a file from script tag.
   * @return {string}
   */
  require(file, issuer, isScript = false) {
    const handlerName = isScript ? this.requireScriptHandlerName : this.requireHandlerName;
    return `${handlerName}(${file},'${issuer}')`;
  }

  /**
   * @param {string} templateFile The path of template file.
   * @param {string} source The function body.
   * @param {Object} locals The local template variables.
   * @return {string}
   * @throws
   */
  run(templateFile, source, locals) {
    try {
      const script = new vm.Script(source, { filename: templateFile });
      script.runInContext(this.contextObject);
      return this.contextObject[this.templateName](locals);
    } catch (error) {
      dependency.watch();
      executeTemplateFunctionException(error, templateFile);
    }
  }
}

module.exports = VMScript;
