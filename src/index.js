// add polyfill for node.js >= 12.0.0 && < 15.0.0
require('./polyfills/string.replaceAll');

const path = require('path');
const pug = require('pug');
const walk = require('pug-walk');
const { isWin } = require('./utils');
const resolver = require('./resolver');
const loader = require('./loader');
const { getPugCompileErrorMessage } = require('./exeptions');

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
  resolve: (filename, templateFile, options) => resolver.resolve(filename.trim(), templateFile.trim()),

  /**
   * Resolve the filename for require().
   *
   * @param {{}} ast The parsed tree of pug template.
   * @return {{}}
   */
  preCodeGen: (ast) =>
    walk(ast, (node) => {
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
            const result = resolver.resolveResource(attr.filename, attr.val);
            if (result != null && result !== attr.val) attr.val = result;
          }
        });
      }
    }),
};

/**
 * Whether the node value contains the require().
 *
 * @param {{val: *}} obj
 * @return {boolean}
 */
const containRequire = (obj) => obj.val && typeof obj.val === 'string' && obj.val.indexOf('require(') >= 0;

/**
 * @param {string} content The pug template.
 * @param {function(error: string|null, result: string?)?} callback The asynchronous callback function.
 * @return {string|undefined}
 */
const compile = function (content, callback) {
  const loaderContext = this;
  const loaderOptions = loaderContext.getOptions() || {};
  const { _compiler: webpackCompiler, resourcePath: filename, rootContext: context, resourceQuery } = loaderContext;
  const webpackOptions = webpackCompiler.options;
  const resolverOptions = webpackOptions.resolve || {};

  if (!loaderOptions.name) loaderOptions.name = 'template';

  const compileOptions = {
    // used to resolve import/extends and to improve errors
    filename,
    // the root directory of all absolute inclusion, defaults is `/`.
    basedir: loaderOptions.basedir || '/',
    doctype: loaderOptions.doctype || 'html',
    filters: loaderOptions.filters,
    self: loaderOptions.self || false,
    globals: ['require', ...(loaderOptions.globals || [])],
    // add the plugin to resolve include, extends, require
    plugins: [resolvePlugin, ...(loaderOptions.plugins || [])],
    // the name of template function, defaults `template`
    name: loaderOptions.name,
    // include inline runtime functions must be true
    inlineRuntimeFunctions: true,
    // for the pure function code w/o exports the module, must be false
    module: false,
    // include the function source in the compiled template, defaults is false
    compileDebug: loaderOptions.debug || false,
    // output compiled function to stdout, must be false
    debug: false,
    /** @deprecated This option is deprecated and must be false, see https://pugjs.org/api/reference.html#options */
    pretty: false,
  };

  let compileResult;

  resolver.init({
    context,
    basedir: compileOptions.basedir,
    options: resolverOptions,
  });
  loader.init({
    resourceQuery,
    // in pug can be used external data, e.g. htmlWebpackPlugin.options
    customData: getHtmlWebpackPluginOptions(webpackOptions, filename),
    options: loaderOptions,
  });
  resolver.setLoader(loader);
  loader.setResolver(resolver);

  loaderContext.cacheable && loaderContext.cacheable(true);

  try {
    /** @type {{body: string, dependencies: []}} */
    compileResult = pug.compileClientWithDependenciesTracked(content, compileOptions);
  } catch (error) {
    // watch files in which an error occurred
    if (error.filename) loaderContext.addDependency(path.normalize(error.filename));
    callback(getPugCompileErrorMessage(error));
    return;
  }
  const result = loader.export(filename, compileResult.body);

  // add dependency files to watch changes
  const dependencies = [...compileResult.dependencies, ...resolver.getDependencies()];
  if (isWin) {
    dependencies.forEach((file, index, files) => {
      files[index] = path.normalize(file);
    });
  }
  dependencies.forEach(loaderContext.addDependency);

  callback(null, result);
};

/**
 * Get user options of HtmlWebpackPlugin({}).
 *
 * @param {Object} webpackOptions The webpack config options.
 * @param {string} filename The filename of pug template.
 * @returns {{htmlWebpackPlugin: {options: {}}}}
 */
const getHtmlWebpackPluginOptions = (webpackOptions, filename) => {
  const plugins = webpackOptions.plugins;
  let options = {};

  if (plugins) {
    const pluginData = plugins.find(
      (item) => item.constructor.name === 'HtmlWebpackPlugin' && item.options.template.indexOf(filename) >= 0
    );

    if (pluginData) {
      options = { htmlWebpackPlugin: { options: {} } };

      if (pluginData.hasOwnProperty('userOptions')) {
        options.htmlWebpackPlugin.options = pluginData.userOptions;
      }
    }
  }

  return options;
};

module.exports = function (content, map, meta) {
  const callback = this.async();

  compile.call(this, content, (err, result) => {
    if (err) return callback(err);
    callback(null, result, map, meta);
  });
};
