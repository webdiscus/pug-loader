const fs = require('fs');
const path = require('path');
const pug = require('pug');
const { plugin, ScriptCollection } = require('./Modules');
const Dependency = require('./Dependency');
const Resolver = require('./Resolver');
const Loader = require('./Loader');
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

let lastTag = '';

/**
 * Resolve filenames in Pug node.
 *
 * @param {Object} node The Pug AST Node.
 */
const resolveNode = (node) => {
  switch (node.type) {
    case 'Code':
      if (isRequired(node.val)) {
        node.val =
          lastTag === 'script'
            ? Loader.resolveScript(node.val, node.filename)
            : Loader.resolveResource(node.val, node.filename);
      }
      break;
    case 'Mixin':
      if (isRequired(node.args)) {
        node.args = Loader.resolveResource(node.args, node.filename);
      }
      break;
    case 'Each':
    case 'EachOf':
      if (isRequired(node.obj)) {
        node.obj = Loader.resolveResource(node.obj, node.filename);
      }
      break;
    case 'Tag':
      lastTag = node.name;
    // fallthrough
    default:
      resolveNodeAttributes(node, 'attrs');
      resolveNodeAttributes(node, 'attributeBlocks');
      break;
  }
};

/**
 * Resolve required filenames in Pug node attributes.
 *
 * @param {Object} node The Pug AST Node.
 * @param {string} attrName The node attribute name.
 */
const resolveNodeAttributes = (node, attrName) => {
  const attrs = node[attrName];
  if (!attrs || attrs.length === 0) return;

  for (let attr of attrs) {
    const value = attr.val;
    if (isRequired(value)) {
      if (node.name === 'script') {
        attr.val = Loader.resolveScript(value, attr.filename);
      } else if (node.name === 'link' && node.attrs.find(isStyle)) {
        attr.val = Loader.resolveStyle(value, attr.filename);
      } else {
        attr.val = Loader.resolveResource(value, attr.filename);
      }
    }
  }
};

/**
 * Traverse all Pug nodes and resolve filename in each node.
 *
 * @note: This is implementation of the 'pug-walk' logic without recursion, up to x2.5 faster.
 *
 * @param {Object} tree The tree of Pug nodes.
 */
const walkTree = (tree) => {
  let stack = [tree];
  let ast, i;

  while ((ast = stack.pop())) {
    while (true) {
      resolveNode(ast);

      switch (ast.type) {
        case 'Tag':
        case 'Code':
        case 'Case':
        case 'Mixin':
        case 'When':
        case 'While':
        case 'EachOf':
          if (ast.block) stack.push(ast.block);
          break;
        case 'Each':
          if (ast.block) stack.push(ast.block);
          if (ast.alternate) stack.push(ast.alternate);
          break;
        case 'Conditional':
          if (ast.consequent) stack.push(ast.consequent);
          if (ast.alternate) stack.push(ast.alternate);
          break;
        default:
          break;
      }

      if (!ast.nodes || ast.nodes.length === 0) break;

      const lastIndex = ast.nodes.length - 1;
      for (i = 0; i < lastIndex; i++) {
        stack.push(ast.nodes[i]);
      }
      ast = ast.nodes[lastIndex];
    }
  }
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
    return Resolver.resolve(filename.trim(), templateFile.trim());
  },

  /**
   * Resolve the filename in require().
   *
   * @param {{}} tree The parsed tree of pug template.
   * @return {{}}
   */
  preCodeGen(tree) {
    walkTree(tree);
    return tree;
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
  const { rootContext: context, resource, resourcePath: filename, resourceQuery } = loaderContext;
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
    customData = HtmlWebpackPlugin.getUserOptions(filename, webpackOptions);
  }

  // prevent double initialisation with same options, occurs when many Pug files used in one webpack config
  if (!plugin.isCached(context)) {
    if (loaderOptions.embedFilters) loadFilters(loaderOptions.embedFilters);

    Resolver.init({
      basedir,
      options: webpackOptions.resolve || {},
    });
  }

  Loader.init({
    //filename,
    filename: resource,
    resourceQuery,
    options: loaderOptions,
    customData,
    isPlugin,
  });

  Dependency.init({
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
      Dependency.add(error.filename);
    }
    Dependency.watch();

    // render error message for output in browser
    const exportError = Loader.exportError(error, getPugCompileErrorHtml);
    const compileError = new Error(getPugCompileErrorMessage(error));
    callback(compileError, exportError);

    return;
  }

  try {
    result = Loader.export(compileResult);
  } catch (error) {
    // render error message for output in browser
    const exportError = Loader.exportError(error, getExecuteTemplateFunctionErrorMessage);
    const compileError = new Error(error);
    callback(compileError, exportError);

    return;
  }

  Dependency.watch();
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
