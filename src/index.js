// add polyfill for node.js >= 12.0.0 && < 15.0.0
require('./polyfills/string.replaceAll');

const path = require('path'),
  pug = require('pug'),
  walk = require('pug-walk'),
  { merge } = require('webpack-merge'),
  { resolveTemplatePath, resolveResourcePath, getResourceParams, injectExternalVariables } = require('./utils'),
  loaderMethods = require('./loader-methods');

// the variables with global scope for the resolvePlugin
let webpackResolveAlias = {},
  loaderMethod = null,
  codeDependencies = [];

const isRendering = (loaderMethod) => ['html', 'render'].indexOf(loaderMethod.method) > -1;

/**
 * Resolve the code file path in require ().
 *
 * @param {string} templateFile The filename of the template where resolves the resource.
 * @param {string} value The resource value include require().
 * @param {{}} aliases The resolve.alias from webpack config.
 * @return {string}
 */
const resolveCodePath = (templateFile, value, aliases) =>
  value.replaceAll(/(require\(.+?\))/g, (value) => {
    const [, sourcePath] = /(?<=require\("|'|`)(.+)(?="|'|`\))/.exec(value) || [];
    let resolvedPath = resolveTemplatePath(sourcePath, aliases);
    if (sourcePath === resolvedPath) resolvedPath = path.join(path.dirname(templateFile), resolvedPath);

    // Important: delete the file from require.cache to allow reload cached files after changes by watch.
    delete require.cache[resolvedPath];
    codeDependencies.push(resolvedPath);

    return `require('${resolvedPath}')`;
  });

/**
 * The pug plugin to resolve path for include, extend, require.
 *
 * @type {{preLoad: (function(*): *)}}
 */
const resolvePlugin = {
  preLoad: (ast) =>
    walk(ast, (node) => {
      if (node.type === 'FileReference') {
        // resolving for extends/include
        let result = resolveTemplatePath(node.path, webpackResolveAlias);
        if (result && result !== node.path) node.path = result;
      } else if (node.type === 'Code' && isRendering(loaderMethod)) {
        // resolving for require of a code, e.g.: `- var data = require('./data.js')` (its need only by rendering)
        if (node.val && node.val.indexOf('require(') > 0) {
          let result = resolveCodePath(node.filename, node.val, webpackResolveAlias);
          if (result && result !== node.val) node.val = result;
        }
      } else if (node.attrs) {
        // resolving for tag attributes, e.g.: img(src=require('./image.jpeg'))
        node.attrs.forEach((attr) => {
          if (attr.val && typeof attr.val === 'string' && attr.val.indexOf('require(') === 0) {
            let result = resolveResourcePath(attr.filename, attr.val, webpackResolveAlias, loaderMethod);
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
    callback('\n[pug-loader] Pug compilation failed.\n' + exception.toString());
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
