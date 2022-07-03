/**
 * @typedef LoaderMethod
 * @property {string} method The compiler export method, defined in loader option.
 * @property {string} queryParam The same as `method`, but defined in resource query parameter.
 * @property {function(file:string, context:string)=} loaderRequire The function to resolve resource file in template.
 * @property {function(file:string, context:string)} require The inject require of resource.
 * @property {function(templateFile:string, source:string, locals:{})} export Generates a result of loader method.
 */

const vm = require('vm');
const path = require('path');
const { merge } = require('webpack-merge');
const { getQueryData, injectExternalData, isWin, pathToPosix } = require('./utils');
const { executeTemplateFunctionException } = require('./exeptions');

const scriptTagQuery = '?isScript';
let hmrRequest = path.join(__dirname, 'hmr.js') + scriptTagQuery;
if (isWin) hmrRequest = pathToPosix(hmrRequest);

/**
 * @typedef {Object} Loader
 * @property {function(file:string, templateFile: string): string} require
 */

const loader = {
  resolver: null,
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

  requireScript(file, templateFile) {
    return this.method.requireScript(file, templateFile);
  },

  /**
   * @param {string} templateFile
   * @param {string} source
   * @return {string}
   */
  export(templateFile, source) {
    return this.method.export(templateFile, source, this.data);
  },

  /**
   * @param {Error} error
   * @param {Function} getErrorMessage
   * @return {string}
   */
  exportError(error, getErrorMessage) {
    return this.method.exportError(error, getErrorMessage);
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

      require(file, templateFile) {
        const resolvedFile = loader.resolver.interpolate(file, templateFile);

        return `require(${resolvedFile})`;
      },

      requireScript(file, templateFile) {
        const resolvedFile = loader.resolver.interpolate(file, templateFile, true);

        return `require(${resolvedFile} + '${scriptTagQuery}')`;
      },

      export(templateFile, source, locals) {
        if (Object.keys(locals).length > 0) {
          source = injectExternalData(source, locals);
        }
        return source + ';' + loader.getExportCode() + loader.templateName + ';';
      },

      exportError(error, getErrorMessage) {
        const requireHmrScript = `' + require('${hmrRequest}') + '`;
        const errStr = error.toString().replace(/'/g, "\\'");
        const message = getErrorMessage.call(null, errStr, requireHmrScript);

        return loader.getExportCode() + `() => '${message}';`;
      },
    },

    {
      // render into HTML and export a JS module
      method: 'render',
      queryParam: 'pug-render',

      encodeReservedChars(str) {
        if (str.indexOf('?') < 0) return str;

        const match = /[&'"]/g;
        const replacements = {
          '&': '\\u0026',
          "'": '\\u0060',
          '"': '\\u0060',
        };
        const replacer = (value) => replacements[value];

        return str.replace(match, replacer);
      },

      decodeReservedChars(str) {
        const match = /('|\\u0026|\\u0027|\\u0060|\n)/g;
        const replacements = {
          "'": "\\'",
          '\\u0026': '&',
          '\\u0027': "'",
          '\\u0060': "\\'",
          '\n': '\\n',
        };
        const replacer = (value) => replacements[value];

        return str.replace(match, replacer);
      },

      loaderRequire(file, templateFile) {
        let resolvedFile = loader.resolver.resolve(file, templateFile);

        if (!path.extname(resolvedFile) || loader.resolver.isScript(resolvedFile)) {
          return require(resolvedFile);
        }

        resolvedFile = this.encodeReservedChars(resolvedFile);

        return `\\u0027 + require(\\u0027${resolvedFile}\\u0027) + \\u0027`;
      },

      loaderRequireScript(file, templateFile) {
        const resolvedFile = loader.resolver.resolve(file, templateFile, true);

        return `\\u0027 + require(\\u0027${resolvedFile}${scriptTagQuery}\\u0027) + \\u0027`;
      },

      require(file, templateFile) {
        return `__PUG_LOADER_REQUIRE__(${file}, '${templateFile}')`;
      },

      requireScript(file, templateFile) {
        return `__PUG_LOADER_REQUIRE_SCRIPT__(${file}, '${templateFile}')`;
      },

      export(templateFile, source, locals) {
        let result = runTemplateFunction(templateFile, source, locals);

        return loader.getExportCode() + "'" + this.decodeReservedChars(result) + "';";
      },

      exportError(error, getErrorMessage) {
        const requireHmrScript = `' + require('${hmrRequest}') + '`;
        const errStr = error.toString().replace(/'/g, "\\'");
        const message = getErrorMessage.call(null, errStr, requireHmrScript);
        return loader.getExportCode() + "'" + message + "';";
      },
    },

    {
      // render into HTML and return the pure string
      // notes:
      //   - this method require an additional loader, like `html-loader`, to handle HTML string
      //   - the require() function for resources must be omitted to allow handle the `src` in `html-loader`
      method: 'html',
      queryParam: null,

      encodeReservedChars(str) {
        // encode reserved chars in query only
        if (str.indexOf('?') < 0) return str;

        return str.replace(/&/g, '\\u0026');
      },

      decodeReservedChars(str) {
        return str.replace(/\\u0026/g, '&');
      },

      loaderRequire(file, templateFile) {
        let resolvedFile = loader.resolver.resolve(file, templateFile);

        if (!path.extname(resolvedFile) || loader.resolver.isScript(resolvedFile)) {
          return require(resolvedFile);
        }

        return this.encodeReservedChars(resolvedFile);
      },

      loaderRequireScript(file, templateFile) {
        const resolvedFile = loader.resolver.resolve(file, templateFile, true);

        return `${resolvedFile}${scriptTagQuery}`;
      },

      require(file, templateFile) {
        return `__PUG_LOADER_REQUIRE__(${file}, '${templateFile}')`;
      },

      // note: the usage of `<script src=require('./main.js')>` for `html` method is not available
      requireScript(file, templateFile) {
        return `__PUG_LOADER_REQUIRE_SCRIPT__(${file}, '${templateFile}')`;
      },

      export(templateFile, source, locals) {
        let result = runTemplateFunction(templateFile, source, locals);

        return this.decodeReservedChars(result);
      },

      exportError(error, getErrorMessage) {
        return getErrorMessage.call(null, error.toString(), hmrRequest);
      },
    },
  ],
};

/**
 * @param {string} templateFile The path of template file.
 * @param {string} source The function body.
 * @param {Object} locals The local template variables.
 * @return {string}
 * @throws
 */
const runTemplateFunction = (templateFile, source, locals) => {
  try {
    const contextOptions = {
      require,
      __PUG_LOADER_REQUIRE__: loader.method.loaderRequire.bind(loader.method),
      __PUG_LOADER_REQUIRE_SCRIPT__: loader.method.loaderRequireScript.bind(loader.method),
    };
    const contextObject = vm.createContext(contextOptions);
    const script = new vm.Script(source, { filename: templateFile });

    script.runInContext(contextObject);

    return contextObject[loader.templateName](locals);
  } catch (error) {
    loader.resolver.dependency.watch();
    executeTemplateFunctionException(error, templateFile);
  }
};

module.exports = loader;
