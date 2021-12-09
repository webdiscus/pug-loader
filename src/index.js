// add polyfill for node.js >= 12.0.0 && < 15.0.0
require('./polyfills/string.replaceAll');

const path = require('path'),
  pug = require('pug'),
  walk = require('pug-walk'),
  { merge } = require('webpack-merge'),
  {
    resolveTemplatePath,
    resolveRequireCode,
    resolveRequireResource,
    getResourceParams,
    injectExternalVariables,
  } = require('./utils'),
  loaderMethods = require('./loader-methods'),
  loader = 'pug-loader';

// the variables with global scope for the resolvePlugin
let webpackResolveAlias = {},
  loaderMethod = null,
  codeDependencies = [];

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
   * @param {string} source The absolute path to template.
   * @param {{}} options The options of pug compiler.
   * @return {string}
   */
  resolve: (filename, source, options) => {
    let resolvedFile = filename.trim();

    if (resolvedFile[0] === '/') {
      if (!options.basedir) optionBasedirException();
      resolvedFile = path.join(options.basedir, resolvedFile);
    } else {
      if (!source) noSourceException();
      resolvedFile = resolveTemplatePath(resolvedFile, webpackResolveAlias);
      // note: on windows an absolute path begin not with `/` otherwise as like `C:\`
      if (!path.isAbsolute(resolvedFile)) {
        resolvedFile = path.join(path.dirname(source.trim()), resolvedFile);
      }
    }

    return resolvedFile;
  },

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
          let result = resolveRequireCode(node.filename, node.val, webpackResolveAlias, codeDependencies);
          if (result && result !== node.val) node.val = result;
        }
      } else if (node.attrs) {
        // resolving for tag attributes, e.g.: img(src=require('./image.jpeg'))
        node.attrs.forEach((attr) => {
          if (containRequire(attr)) {
            let result = resolveRequireResource(attr.filename, attr.val, webpackResolveAlias, loaderMethod);
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

const optionBasedirException = () => {
  throw new Error(`[${loader}] the "basedir" option is required to use includes and extends with "absolute" paths.`);
};

const noSourceException = () => {
  throw new Error(`[${loader}] the "filename" option is required to use includes and extends with "relative" paths.`);
};

/**
 * @param {string} content The pug template.
 * @param {function(error: string|null, result: string?)?} callback The asynchronous callback function.
 * @return {string|undefined}
 */
const compilePugContent = function (content, callback) {
  let res = {};

  const loaderContext = this,
    loaderOptions = loaderContext.getOptions() || {},
    esModule = loaderOptions.esModule === true,
    resourceParams = getResourceParams(loaderContext.resourceQuery),
    // the rule: a method defined in the resource query has highest priority over a method defined in the loader options
    // because a method from loader options is global but a query method override by local usage a global method
    methodFromQuery = loaderMethods.find((item) => resourceParams.hasOwnProperty(item.queryParam)),
    methodFromOptions = loaderMethods.find((item) => loaderOptions.method === item.method);

  // define the `loaderMethod` for global scope in this module
  loaderMethod = methodFromQuery || methodFromOptions || loaderMethods[0];

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

  loaderContext.cacheable && loaderContext.cacheable(true);

  try {
    /** @type {{body: string, dependencies: []}} */
    res = pug.compileClientWithDependenciesTracked(content, options);
  } catch (exception) {
    // watch files in which an error occurred
    if (exception.filename) loaderContext.addDependency(path.normalize(exception.filename));
    callback(`\n[${loader}] Pug compilation failed.\n` + exception.toString());
    return;
  }

  // add dependency files to watch changes
  res.dependencies.forEach(loaderContext.addDependency);
  codeDependencies.forEach(loaderContext.addDependency);

  // remove pug method from query data to pass only clean data w/o options
  delete resourceParams[loaderMethod.queryParam];

  const locals = merge(loaderOptions.data || {}, resourceParams),
    funcBody = Object.keys(locals).length ? injectExternalVariables(res.body, locals) : res.body,
    output = loaderMethod.output(funcBody, locals, esModule);

  callback(null, output);
};

module.exports = function (content, map, meta) {
  const callback = this.async();

  // save resolve.alias from webpack config for global scope in this module,
  webpackResolveAlias = this._compiler.options.resolve.alias || {};

  compilePugContent.call(this, content, (err, result) => {
    if (err) return callback(err);
    callback(null, result, map, meta);
  });
};
