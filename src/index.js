const path = require('path'),
  pug = require('pug'),
  walk = require('pug-walk'),
  { merge } = require('webpack-merge'),
  { resolveTemplatePath, resolveResourcePath, getResourceParams, injectExternalVariables } = require('./utils'),
  loaderMethods = require('./loader-methods');

// the variables with global scope for the resolvePlugin
let webpackResolveAlias = {},
  loaderMethod = null;

/**
 * Pug plugin to resolve path for include, extend, require.
 *
 * @type {{preLoad: (function(*): *)}}
 */
const resolvePlugin = {
  preLoad: (ast) =>
    walk(ast, (node) => {
      if (node.type === 'FileReference') {
        //let result = resolveAlias(node.path, webpackResolveAlias, regexpAlias);
        let result = resolveTemplatePath(node.path, webpackResolveAlias);
        if (result && result !== node.path) node.path = result;
      } else if (node.attrs) {
        node.attrs.forEach((attr) => {
          if (attr.val && typeof attr.val === 'string' && attr.val.indexOf('require(') === 0) {
            let result = resolveResourcePath(attr.val, attr.filename, webpackResolveAlias, loaderMethod);
            if (result && result !== attr.val) attr.val = result;
          }
        });
      }
    }),
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

  // pug compiler options
  const options = {
    // used to resolve imports/extends and to improve errors
    filename: loaderContext.resourcePath,
    // The root directory of all absolute inclusion. Defaults is /.
    basedir: loaderOptions.basedir || '/',
    doctype: loaderOptions.doctype || 'html',
    /** @deprecated This option is deprecated and must be false, see https://pugjs.org/api/reference.html#options */
    pretty: false,
    filters: loaderOptions.filters,
    self: loaderOptions.self || false,
    // Output compiled function to stdout. Must be false.
    debug: false,
    // Include the function source in the compiled template. Defaults is false.
    compileDebug: loaderOptions.debug || false,
    //globals: ['require', ...(loaderOptions.globals || [])],
    globals: ['__asset_resource_require__', 'require', ...(loaderOptions.globals || [])],
    // Include inline runtime functions must be true.
    inlineRuntimeFunctions: true,
    // module must be false to get compiled function body w/o export code
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
    // show original error
    console.log('[pug compiler error] ', exception);
    // watch files in which an error occurred
    if (exception.filename) loaderContext.addDependency(path.normalize(exception.filename));
    callback(exception);
    return;
  }

  // add dependency files to watch changes
  if (res.dependencies.length) res.dependencies.forEach(loaderContext.addDependency);

  // remove pug method from query data to pass only clean data w/o options
  delete resourceParams[loaderMethod.queryParam];

  const locals = merge(loaderOptions.data || {}, resourceParams),
    funcBody = Object.keys(locals).length ? injectExternalVariables(res.body, locals) : res.body,
    output = loaderMethod.output(funcBody, locals, esModule);

  callback(null, output);
};

// Asynchronous Loader, see https://webpack.js.org/api/loaders/#asynchronous-loaders
module.exports = function (content, map, meta) {
  const callback = this.async();

  // save resolve.alias from webpack config for global scope in this module,
  // see https://webpack.js.org/api/loaders/#this_compiler
  webpackResolveAlias = this._compiler.options.resolve.alias || {};

  compilePugContent.call(this, content, (err, result) => {
    if (err) return callback(err);
    callback(null, result, map, meta);
  });
};
