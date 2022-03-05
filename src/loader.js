/**
 * @typedef LoaderMethod
 * @property {string} method The compiler export method, defined in loader option.
 * @property {string} queryParam The same as `method`, but defined in resource query parameter.
 * @property {function(file:string, context:string)=} loaderRequire The function to resolve resource file in template.
 * @property {function(file:string, context:string)} require The inject require of resource.
 * @property {function(templateFile:string, funcBody:string, locals:{})} export Generates a result of loader method.
 */

const path = require('path');
const { merge } = require('webpack-merge');
const { getQueryData, injectExternalVariables } = require('./utils');
const { executeTemplateFunctionException } = require('./exeptions');

/**
 * @typedef {Object} Loader
 * @property {function(file:string, templateFile: string): string} require
 */

const loader = {
  resolver: {},
  method: null,
  esModule: false,

  /**
   * @param {string} resourceQuery
   * @param {{}} customData
   * @param {{}} options
   */
  init({ resourceQuery, customData, options }) {
    const { esModule, name, method, data } = options;
    this.esModule = esModule === true;
    this.templateName = name;

    // the rule: a method defined in the resource query has the highest priority over a method defined in the loaderName options
    // because a method from loaderName options is global but a query method override by local usage a global method
    const queryData = getQueryData(resourceQuery);
    const methodFromQuery = this.methods.find((item) => queryData.hasOwnProperty(item.queryParam));
    const methodFromOptions = this.methods.find((item) => method === item.method);
    if (methodFromQuery) {
      this.method = methodFromQuery;
    } else if (methodFromOptions) {
      this.method = methodFromOptions;
    } else {
      // default method is `compile`
      this.method = this.methods[0];
    }

    // remove pug method from query data to pass in pug only clean data
    if (queryData.hasOwnProperty(this.method.queryParam)) {
      delete queryData[this.method.queryParam];
    }

    this.data = merge(data || {}, customData || {}, queryData);
  },

  /**
   * @param {LoaderResolver} resolver
   */
  setResolver(resolver) {
    this.resolver = resolver;
  },

  getExportCode() {
    return this.esModule ? 'export default ' : 'module.exports=';
  },

  /**
   * @param {string} file The file of required resource.
   * @param {string} templateFile The template file where the file is required.
   * @return {string}
   */
  require(file, templateFile) {
    return this.method.require(file, templateFile);
  },

  /**
   * @param {string} templateFile
   * @param {string} funcBody
   * @return {string}
   */
  export(templateFile, funcBody) {
    return this.method.export(templateFile, funcBody, this.data);
  },

  /**
   * Loader methods to return a result.
   * @type {Array<LoaderMethod>}
   */
  methods: [
    {
      // compile into template function and export a JS module
      method: 'compile',
      queryParam: 'pug-compile',

      require: (file, templateFile) => {
        const resolvedFile = loader.resolver.interpolate(file, templateFile);

        loader.resolver.addDependency(resolvedFile);

        return `require(${resolvedFile})`;
      },

      export: (templateFile, funcBody, locals) => {
        if (Object.keys(locals).length > 0) {
          funcBody = injectExternalVariables(funcBody, locals);
        }
        return funcBody + ';' + loader.getExportCode() + loader.templateName + ';';
      },
    },

    {
      // render into HTML and export a JS module
      method: 'render',
      queryParam: 'pug-render',

      loaderRequire(file, templateFile) {
        const resolvedFile = loader.resolver.resolve(file, templateFile);

        loader.resolver.addDependency(resolvedFile);

        if (!path.extname(resolvedFile) || loader.resolver.isScript(resolvedFile)) {
          return require(resolvedFile);
        }

        return `\\u0027 + require(\\u0027${resolvedFile}\\u0027) + \\u0027`;
      },

      require(file, templateFile) {
        return `__PUG_LOADER_REQUIRE__(${file}, '${templateFile}')`;
      },

      export(templateFile, funcBody, locals) {
        const result = runTemplateFunction(funcBody, locals, this.loaderRequire, templateFile)
          .replace(/\n/g, '\\n')
          .replace(/'/g, "\\'")
          .replace(/\\u0027/g, "'");

        return loader.getExportCode() + "'" + result + "';";
      },
    },

    {
      // render into HTML and return the pure string
      // notes:
      //   - this method require an additional loader, like `html-loader`, to handle HTML string
      //   - the require() function for embedded resources must be removed to allow handle the `src` in `html-loader`
      method: 'html',
      queryParam: null,

      loaderRequire(file, templateFile) {
        const resolvedFile = loader.resolver.resolve(file, templateFile);

        loader.resolver.addDependency(resolvedFile);

        if (!path.extname(resolvedFile) || loader.resolver.isScript(resolvedFile)) {
          return require(resolvedFile);
        }

        return resolvedFile;
      },

      require(file, templateFile) {
        return `__PUG_LOADER_REQUIRE__(${file}, '${templateFile}')`;
      },

      export(templateFile, funcBody, locals) {
        return runTemplateFunction(funcBody, locals, this.loaderRequire, templateFile);
      },
    },
  ],
};

/**
 * @param {string} funcBody The function body.
 * @param {Object} locals The local template variables.
 * @param {Function} methodRequire The require function for the method.
 * @param {string} templateFile The path of template file.
 * @returns {string}
 */
const runTemplateFunction = (funcBody, locals, methodRequire, templateFile) => {
  let result;

  try {
    result = new Function('require', '__PUG_LOADER_REQUIRE__', funcBody + ';return ' + loader.templateName + ';')(
      require,
      methodRequire
    )(locals);
  } catch (error) {
    executeTemplateFunctionException(error, templateFile);
  }

  return result;
};

module.exports = loader;
