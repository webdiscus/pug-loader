const fs = require('fs');
const path = require('path');
const pug = require('pug');
const walk = require('pug-walk');
const { plugin, scriptStore } = require('./Modules');
const dependency = require('./Dependency');
const resolver = require('./Resolver');
const loader = require('./Loader');
const { trimIndent } = require('./Utils');

const HtmlWebpackPlugin = require('./extras/HtmlWebpackPlugin');

const {
  filterNotFoundException,
  filterLoadException,
  filterInitException,
  getPugCompileErrorMessage,
  getPugCompileErrorHtml,
  getExecuteTemplateFunctionErrorMessage,
} = require('./Exeptions');

const filtersDir = path.join(__dirname, './filters/');

/**
 * Load embedded pug filters.
 * @param {{filterName: string, options: boolean|string|object}} filters
 */
const loadFilters = (filters) => {
  for (const filterName in filters) {
    const options = filters[filterName];
    if (options) {
      let filterPath = path.resolve(filtersDir, filterName + '.js');
      let filter;

      try {
        filter = require(filterPath);
      } catch (error) {
        const message = error.toString();

        if (message.indexOf('Cannot find module') >= 0 && message.indexOf('Please install the module') < 0) {
          const entries = fs.readdirSync(filtersDir, { withFileTypes: true });
          const files = entries.filter((file) => !file.isDirectory()).map((file) => path.basename(file.name, '.js'));
          filterNotFoundException(filterName, files.join(', '));
        }
        filterLoadException(filterName, filterPath, error);
      }

      try {
        // filter module may have the `init(options)` method
        if (filter.init != null) {
          filter.init(options);
        }
        // add filter to pug compiler
        pug.filters[filterName] = filter.apply.bind(filter);
      } catch (error) {
        filterInitException(filterName, error);
      }
    }
  }
};

/**
 * Whether the node value contains the require().
 *
 * @param {string} value
 * @return {boolean}
 */
const isRequired = (value) => value != null && typeof value === 'string' && value.indexOf('require(') > -1;

/**
 * Whether the node attribute belongs to style.
 *
 * @param {Array<name: string, val: string>} item
 * @return {boolean}
 */
const isStyle = (item) => item.name === 'rel' && item.val.indexOf('stylesheet') > -1;

/**
 * The pug plugin to resolve path for include, extends, require.
 *
 * @type {{resolve: (function(string, string, {}): string), preCodeGen: (function({}): *)}}
 */
const resolvePlugin = {
  /**
   * Resolve the filename for extends / include / raw include.
   *
   * @param {string} filename The extends/include filename in template.
   * @param {string} templateFile The absolute path to template.
   * @param {{}} options The options of pug compiler.
   * @return {string}
   */
  resolve(filename, templateFile, options) {
    return resolver.resolve(filename.trim(), templateFile.trim());
  },

  /**
   * Resolve the filename for require().
   *
   * @param {{}} ast The parsed tree of pug template.
   * @return {{}}
   */
  preCodeGen(ast) {
    return walk(ast, (node) => {
      if (node.type === 'Code') {
        // resolving for require in code, like `- var data = require('./data.js')`
        const value = node.val;
        if (isRequired(value)) {
          node.val = loader.resolveResource(value, node.filename);
        }
      } else if (node.attrs) {
        // resolving of required files in tag attributes
        for (let attr of node.attrs) {
          const value = attr.val;
          if (isRequired(value)) {
            if (node.name === 'script') {
              attr.val = loader.resolveScript(value, attr.filename);
            } else if (node.name === 'link' && node.attrs.find(isStyle)) {
              attr.val = loader.resolveStyle(value, attr.filename);
            } else {
              attr.val = loader.resolveResource(value, attr.filename);
            }
          }
        }
      }
    });
  },
};

/**
 * @param {string} content The pug template.
 * @param {function(error: Error|null, result: string?)?} callback The asynchronous callback function.
 * @return {string|undefined}
 */
const compile = function (content, callback) {
  const loaderContext = this;
  const loaderOptions = loaderContext.getOptions() || {};
  const webpackOptions = loaderContext._compiler.options || {};
  const { resourcePath: filename, rootContext: context, resourceQuery } = loaderContext;
  const isPlugin = plugin.isUsed();
  let basedir = loaderOptions.basedir || context;
  let customData = {};
  let compileResult, result;

  if (basedir.slice(-1) !== '/') basedir += '/';
  if (!loaderOptions.name) loaderOptions.name = 'template';

  const compilerOptions = {
    // used to resolve import/extends and to improve errors
    filename,

    // the root directory of all absolute inclusion, defaults is `/`.
    basedir,

    doctype: loaderOptions.doctype || 'html',
    self: loaderOptions.self || false,
    globals: ['require', ...(loaderOptions.globals || [])],

    // the name of template function, defaults `template`
    name: loaderOptions.name,

    // filters of rendered content, e.g. markdown-it
    filters: loaderOptions.filters,
    filterOptions: loaderOptions.filterOptions,
    filterAliases: loaderOptions.filterAliases,

    // add the plugin to resolve include, extends, require
    plugins: [resolvePlugin, ...(loaderOptions.plugins || [])],

    // include inline runtime functions must be true
    inlineRuntimeFunctions: true,

    // for the pure function code w/o exports the module, must be false
    module: false,

    // include the function source in the compiled template, defaults is false
    compileDebug: loaderOptions.compileDebug === true,

    // output compiled function to stdout, must be false
    debug: loaderOptions.debug === true,

    // the pretty option is deprecated and must be false, see https://pugjs.org/api/reference.html#options
    // use the `pretty` option of the pug-plugin to format generated HTML.
    pretty: false,
  };

  if (loaderContext.cacheable != null) loaderContext.cacheable(true);

  if (!isPlugin) {
    // trim indent by using as standalone, e.g. with vue
    const template = trimIndent(content);
    if (template !== false) content = template;
    // TODO: drop support HtmlWebpackPlugin in next major version 3.x, because must be used pug-plugin instead
    customData = HtmlWebpackPlugin.getUserOptions(filename, webpackOptions);
  }

  // prevent double initialisation with same options, occurs when many Pug files used in one webpack config
  if (!plugin.isCached(context)) {
    if (loaderOptions.embedFilters) loadFilters(loaderOptions.embedFilters);

    resolver.init({
      basedir,
      options: webpackOptions.resolve || {},
    });
  }

  loader.init({
    filename,
    resourceQuery,
    options: loaderOptions,
    customData,
    isPlugin,
  });

  scriptStore.init({
    issuer: filename,
  });

  dependency.init({
    loaderContext,
    watchFiles: loaderOptions.watchFiles,
  });

  try {
    /** @type {{body: string, dependencies: []}} */
    compileResult = pug.compileClientWithDependenciesTracked(content, compilerOptions).body;

    // Note: don't use compileResult.dependencies because it is not available by compile error.
    // The Pug loader tracks all dependencies during compilation and stores them in `Dependency` instance.
  } catch (error) {
    if (error.filename) {
      dependency.add(error.filename);
    }
    dependency.watch();

    // render error message for output in browser
    const exportError = loader.exportError(error, getPugCompileErrorHtml);
    const compileError = new Error(getPugCompileErrorMessage(error));
    callback(compileError, exportError);

    return;
  }

  try {
    result = loader.export(compileResult);
  } catch (error) {
    // render error message for output in browser
    const exportError = loader.exportError(error, getExecuteTemplateFunctionErrorMessage);
    const compileError = new Error(error);
    callback(compileError, exportError);

    return;
  }

  dependency.watch();
  callback(null, result);
};

module.exports = function (content, map, meta) {
  const loaderContext = this;
  const callback = loaderContext.async();

  compile.call(loaderContext, content, (error, result) => {
    if (error) {
      // if HMR is disabled interrupt the compilation process
      if (loaderContext.hot !== true) return callback(error);

      // if HMR is enabled emit an error that will be displayed in the output
      // it will NOT interrupt the compilation process
      loaderContext.emitError(error);
    }
    callback(null, result, map, meta);
  });
};
