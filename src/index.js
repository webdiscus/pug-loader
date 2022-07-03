const fs = require('fs');
const path = require('path');
const pug = require('pug');
const walk = require('pug-walk');
const { isWin, trimIndent } = require('./utils');
const resolver = require('./resolver');
const loader = require('./loader');
const {
  filterNotFoundException,
  filterLoadException,
  filterInitException,
  getPugCompileErrorMessage,
  getPugCompileErrorHtml,
  getExecuteTemplateFunctionErrorMessage,
} = require('./exeptions');

const HtmlWebpackPlugin = require('./extras/HtmlWebpackPlugin');

// path of embedded pug-loader filters
const filtersDir = path.join(__dirname, './filters/');

/**
 * Dependencies in code for watching a changes.
 *
 * Public API
 * @typedef {Object} LoaderDependency
 * @property {Array<RegExp>} watchFiles
 * @property {Function<loaderContext:Object>} init
 * @property {Function<file:string>} add
 * @property {Function|RegExp} watch
 */

const dependency = {
  files: new Set(),
  watchFiles: [/\.(pug|jade|js.{0,2}|.?js|ts.?|md|txt)$/i],
  loaderContext: null,
  isInit: false,

  init(loaderContext, { watchFiles }) {
    // avoid double push in array by watching
    if (!this.isInit && watchFiles != null) {
      if (!Array.isArray(watchFiles)) watchFiles = [watchFiles];
      this.watchFiles.push(...watchFiles);
      this.isInit = true;
    }
    this.loaderContext = loaderContext;
  },

  /**
   * Add file to watch list.
   *
   * @param {string} file
   */
  add(file) {
    if (!this.watchFiles.find((regex) => regex.test(file))) {
      return;
    }

    file = isWin ? path.normalize(file) : file;
    this.files.add(file);

    // delete the file from require.cache to reload cached files after changes by watch
    delete require.cache[file];
  },

  watch() {
    const files = Array.from(this.files);
    files.forEach(this.loaderContext.addDependency);
  },
};

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
        // resolving for require of a code, e.g.: `- var data = require('./data.js')`
        if (containRequire(node)) {
          const result = resolver.resolveResource(node.filename, node.val);
          if (result != null && result !== node.val) node.val = result;
        }
      } else if (node.attrs) {
        // resolving for tag attributes, e.g.: `img(src=require('./image.jpeg'))`
        node.attrs.forEach((attr) => {
          if (containRequire(attr)) {
            const result =
              node.name === 'script'
                ? resolver.resolveScript(attr.filename, attr.val)
                : resolver.resolveResource(attr.filename, attr.val);
            if (result != null && result !== attr.val) attr.val = result;
          }
        });
      }
    });
  },
};

/**
 * Whether the node value contains the require().
 *
 * @param {{val: *}} obj
 * @return {boolean}
 */
const containRequire = (obj) => obj.val && typeof obj.val === 'string' && obj.val.indexOf('require(') >= 0;

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
 * @param {string} content The pug template.
 * @param {function(error: string|null, result: string?)?} callback The asynchronous callback function.
 * @return {string|undefined}
 */
const compile = function (content, callback) {
  const loaderContext = this;
  const loaderOptions = loaderContext.getOptions() || {};
  const { _compiler: webpackCompiler, resourcePath: filename, rootContext: context, resourceQuery } = loaderContext;
  const webpackOptions = webpackCompiler ? webpackCompiler.options : {};

  if (!loaderOptions.name) loaderOptions.name = 'template';
  if (loaderOptions.embedFilters) loadFilters(loaderOptions.embedFilters);

  const compilerOptions = {
    // used to resolve import/extends and to improve errors
    filename,

    // the root directory of all absolute inclusion, defaults is `/`.
    basedir: loaderOptions.basedir || '/',

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

    /**
     * @deprecated This option is deprecated and must be false, see https://pugjs.org/api/reference.html#options
     * Use the `pretty` option of the pug-plugin to format generated HTML.
     **/
    pretty: false,
  };

  resolver.init({
    context,
    basedir: compilerOptions.basedir,
    options: webpackOptions.resolve || {},
  });

  loader.init({
    resourceQuery,
    // provide custom data from other plugins
    customData: HtmlWebpackPlugin.userOptions(webpackOptions, filename),
    options: loaderOptions,
  });

  dependency.init(loaderContext, loaderOptions);
  resolver.setDependency(dependency);
  resolver.setLoader(loader);
  loader.setResolver(resolver);

  if (loaderContext.cacheable) loaderContext.cacheable(true);

  // remove indent in template
  const template = trimIndent(content);
  if (template !== false) content = template;

  let compileResult, result;
  try {
    /** @type {{body: string, dependencies: []}} */
    compileResult = pug.compileClientWithDependenciesTracked(content, compilerOptions).body;

    // Note: don't use compileResult.dependencies because it is not available by compile error.
    // The Pug loader tracks all dependencies during compilation and stores them in `LoaderDependency`,
    // when a compilation error occurs, the modified dependencies in the corrupted pug file
    // are available in `LoaderDependency` to watching after an error.
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
    result = loader.export(filename, compileResult);
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
