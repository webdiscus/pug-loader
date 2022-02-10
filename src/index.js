// add polyfill for node.js >= 12.0.0 && < 15.0.0
require('./polyfills/string.replaceAll');

const path = require('path');
const pug = require('pug');
const walk = require('pug-walk');
const { merge } = require('webpack-merge');
const { getResourceParams, injectExternalVariables } = require('./utils');
const resolver = require('./resolver');
const loader = require('./loader');
const { getPugCompileErrorMessage } = require('./exeptions');

// the variables with global scope for the resolvePlugin
let loaderMethod = null,
  codeDependencies = [],
  loaderContext = null;

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
          let result = resolver.resolveRequireCode(node.filename, node.val, codeDependencies);
          if (result && result !== node.val) node.val = result;
        }
      } else if (node.attrs) {
        // resolving for tag attributes, e.g.: img(src=require('./image.jpeg'))
        node.attrs.forEach((attr) => {
          if (containRequire(attr)) {
            let result = resolver.resolveRequireResource(attr.filename, attr.val, loaderMethod);
            if (result && result !== attr.val) attr.val = result;
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
const compilePugContent = function (content, callback) {
  let pugResult = {};
  const loaderContext = this,
    webpackOptionsResolve = loaderContext.hasOwnProperty('_compiler')
      ? loaderContext._compiler.options.resolve || {}
      : {},
    loaderOptions = loaderContext.getOptions() || {},
    esModule = loaderOptions.esModule === true,
    resourceParams = getResourceParams(loaderContext.resourceQuery),
    // the rule: a method defined in the resource query has highest priority over a method defined in the loaderName options
    // because a method from loaderName options is global but a query method override by local usage a global method
    methodFromQuery = loader.methods.find((item) => resourceParams.hasOwnProperty(item.queryParam)),
    methodFromOptions = loader.methods.find((item) => loaderOptions.method === item.method);

  // define the `loaderMethod` for global scope in this module
  loaderMethod = methodFromQuery || methodFromOptions || loader.methods[0];

  const options = {
    // used to resolve imports/extends and to improve errors
    filename: loaderContext.resourcePath,
    // the root directory of all absolute inclusion, defaults is `/`.
    basedir: loaderOptions.basedir || '/',
    doctype: loaderOptions.doctype || 'html',
    /** @deprecated This option is deprecated and must be false, see https://pugjs.org/api/reference.html#options */
    pretty: false,
    filters: loaderOptions.filters,
    self: loaderOptions.self || false,
    // output compiled function to stdout, must be false
    debug: false,
    // include the function source in the compiled template, defaults is false
    compileDebug: loaderOptions.debug || false,
    globals: ['require', ...(loaderOptions.globals || [])],
    // include inline runtime functions must be true
    inlineRuntimeFunctions: true,
    // for the pure function code w/o exports the module, must be false
    module: false,
    // default name of template function is `template`
    name: 'template',
    // the template without export module syntax, because the export will be determined depending on the method
    plugins: [resolvePlugin, ...(loaderOptions.plugins || [])],
  };

  // initialize the resolver
  resolver.init(options.basedir, this.rootContext, webpackOptionsResolve);
  loader.setResolver(resolver);

  loaderContext.cacheable && loaderContext.cacheable(true);

  try {
    /** @type {{body: string, dependencies: []}} */
    pugResult = pug.compileClientWithDependenciesTracked(content, options);
  } catch (error) {
    // watch files in which an error occurred
    if (error.filename) loaderContext.addDependency(path.normalize(error.filename));
    callback(getPugCompileErrorMessage(error));
    return;
  }

  // add dependency files to watch changes
  pugResult.dependencies.forEach(loaderContext.addDependency);
  codeDependencies.forEach(loaderContext.addDependency);

  // remove pug method from query data to pass only clean data w/o options
  delete resourceParams[loaderMethod.queryParam];

  // custom options from HtmlWebpackPlugin can be used in pug
  let htmlWebpackPluginOptions = getHtmlWebpackPluginOptions(loaderContext);

  const locals = merge(loaderOptions.data || {}, htmlWebpackPluginOptions, resourceParams),
    funcBody = Object.keys(locals).length ? injectExternalVariables(pugResult.body, locals) : pugResult.body,
    result = loaderMethod.export(loaderContext.resourcePath, funcBody, locals, esModule);

  callback(null, result);
};

/**
 * Get user options of HtmlWebpackPlugin({}).
 *
 * @param {Object} loaderContext The context object of webpack loader.
 * @returns {{htmlWebpackPlugin: {options: {}}}}
 */
const getHtmlWebpackPluginOptions = (loaderContext) => {
  const sourceFile = loaderContext.resourcePath;
  let options = {
    htmlWebpackPlugin: { options: {} },
  };

  if (loaderContext.hasOwnProperty('_compiler')) {
    const plugins = loaderContext._compiler.options.plugins || [];
    const obj = plugins.find(
      (item) => item.constructor.name === 'HtmlWebpackPlugin' && item.options.template.indexOf(sourceFile) >= 0
    );

    if (obj && obj.hasOwnProperty('userOptions')) {
      options.htmlWebpackPlugin.options = obj.userOptions;
    }
  }

  return options;
};

module.exports = function (content, map, meta) {
  const callback = this.async();
  loaderContext = this;

  compilePugContent.call(this, content, (err, result) => {
    if (err) return callback(err);
    callback(null, result, map, meta);
  });
};
