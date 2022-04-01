/**
 * @typedef LoaderMethod
 * @property {string} method The compiler export method, defined in loader option.
 * @property {string} queryParam The same as `method`, but defined in resource query parameter.
 * @property {function(file:string, context:string)=} loaderRequire The function to resolve resource file in template.
 * @property {function(file:string, context:string)} require The inject require of resource.
 * @property {function(templateFile:string, funcBody:string, locals:{})} export Generates a result of loader method.
 */

const vm = require('vm');
const path = require('path');
const { merge } = require('webpack-merge');
const { getQueryData, injectExternalData } = require('./utils');
const { executeTemplateFunctionException } = require('./exeptions');

const scriptTagQuery = '?isScript';

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

  requireScript(file, templateFile) {
    return this.method.requireScript(file, templateFile);
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

      require(file, templateFile) {
        const resolvedFile = loader.resolver.interpolate(file, templateFile);

        loader.resolver.addDependency(resolvedFile);

        return `require(${resolvedFile})`;
      },

      requireScript(file, templateFile) {
        const resolvedFile = loader.resolver.interpolate(file, templateFile);

        loader.resolver.addDependency(resolvedFile);

        return `require(${resolvedFile} + '${scriptTagQuery}')`;
      },

      export(templateFile, funcBody, locals) {
        if (Object.keys(locals).length > 0) {
          funcBody = injectExternalData(funcBody, locals);
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

      loaderRequireScript(file, templateFile) {
        const resolvedFile = loader.resolver.resolve(file, templateFile);

        loader.resolver.addDependency(resolvedFile);

        return `\\u0027 + require(\\u0027${resolvedFile}${scriptTagQuery}\\u0027) + \\u0027`;
      },

      require(file, templateFile) {
        return `__PUG_LOADER_REQUIRE__(${file}, '${templateFile}')`;
      },

      requireScript(file, templateFile) {
        return `__PUG_LOADER_REQUIRE_SCRIPT__(${file}, '${templateFile}')`;
      },

      export(templateFile, funcBody, locals) {
        const result = runTemplateFunction(templateFile, funcBody, locals, this)
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
      //   - the require() function for resources must be omitted to allow handle the `src` in `html-loader`
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

      loaderRequireScript(file, templateFile) {
        const resolvedFile = loader.resolver.resolve(file, templateFile);

        loader.resolver.addDependency(resolvedFile);

        return `${resolvedFile}${scriptTagQuery}`;
      },

      require(file, templateFile) {
        return `__PUG_LOADER_REQUIRE__(${file}, '${templateFile}')`;
      },

      // note: the usage of `<script src=require('./main.js')>` for `html` method is not available
      requireScript(file, templateFile) {
        return `__PUG_LOADER_REQUIRE_SCRIPT__(${file}, '${templateFile}')`;
      },

      export(templateFile, funcBody, locals) {
        return runTemplateFunction(templateFile, funcBody, locals, this);
      },
    },
  ],
};

/**
 * @param {string} templateFile The path of template file.
 * @param {string} funcBody The function body.
 * @param {Object} locals The local template variables.
 * @param {Function} loaderRequire The require function for the method.
 * @param {Function} loaderRequireScript The require script function for the method.
 * @return {string}
 * @throws
 */
const runTemplateFunction = (templateFile, funcBody, locals, { loaderRequire, loaderRequireScript }) => {
  try {
    const contextOptions = {
      require,
      __PUG_LOADER_REQUIRE__: loaderRequire,
      __PUG_LOADER_REQUIRE_SCRIPT__: loaderRequireScript,
    };

    const contextObject = vm.createContext(contextOptions);
    const script = new vm.Script(funcBody, { filename: templateFile });
    script.runInContext(contextObject);

    return contextObject[loader.templateName](locals);
  } catch (error) {
    executeTemplateFunctionException(error, templateFile);
  }
};

module.exports = loader;
