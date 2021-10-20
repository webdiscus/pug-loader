const path = require('path'),
  pug = require('pug'),
  walk = require('pug-walk');

let webpackResolveAlias = {};

/**
 * @param {string} match The matched alias.
 * @return {string} The regex pattern with matched aliases.
 */
const regexpAlias = (match) => `^[~@]?(${match})(?=\\/)`;

/**
 * Replace founded alias in require argument.
 *
 * @param {string} value The resource value include require('').
 * @param {{}} aliases The `resolve.alias` of webpack config.
 * @param {function(string):string} regexp The function return a regex pattern string. The argument is alias name.
 * @return {string} The string with replaced alias.
 */
const resolveAlias = (value, aliases, regexp) => {
  let result = value;
  const patternAliases = Object.keys(aliases).join('|');

  if (!patternAliases) return result;

  const aliasMatch = new RegExp(regexp(patternAliases)).exec(value);
  if (aliasMatch) {
    const alias = aliasMatch[1];
    result = value.replace(new RegExp(regexp(alias)), aliases[alias]).replace('//', '/');
  }

  return result;
};

/**
 * Resolve a path in the argument of require() function.
 *
 * @param {string} value The resource value include require().
 * @param {string} templateFile
 * @param {{}} aliases The resolve.alias from webpack config.
 * @return {string|null}
 */
const resolveRequirePath = function (value, templateFile, aliases) {
  // 1. delete `./` from path, because at begin will be added full path like `/path/to/current/dir/`
  value = value.replace(/(?<=[^\.])(\.\/)/, '');

  // 2. replace alias with absolute path
  let result = resolveAlias(value, aliases, (match) => `(?<=["'\`])(${match})(?=\/)`);
  if (result !== value) return result;

  // 3. if the alias is not found in the path,
  // then add the absolute path of the current template at the beginning of the argument,
  // e.g. like this require('/path/to/template/' + 'filename.jpeg')
  const matches = /\((.+)\)/.exec(value);
  if (matches) {
    let arg = matches[1];
    // 4. if an argument of require() begin with a relative parent path as the string template with a variable,
    // like require(`../images/${file}`), then extract the relative path to the separate string
    if (arg.indexOf('`../') === 0) {
      const relPathRegex = /(?<=`)(.+)(?=\$\{)/;
      const relPathMatches = relPathRegex.exec(value);
      if (relPathMatches) {
        arg = `'${relPathMatches[1]}' + ` + arg.replace(relPathRegex, '');
      }
    }
    result = `require('${path.dirname(templateFile)}/' + ${arg})`;
  }

  return result;
};

/**
 * Pug plugin to resolve path for include, extend, require.
 *
 * @type {{preLoad: (function(*): *)}}
 */
const resolvePlugin = {
  preLoad: (ast) =>
    walk(ast, (node) => {
      if (node.type === 'FileReference') {
        let result = resolveAlias(node.path, webpackResolveAlias, regexpAlias);
        if (result && result !== node.path) node.path = result;
      } else if (node.attrs) {
        node.attrs.forEach((attr) => {
          if (attr.val && typeof attr.val === 'string' && attr.val.indexOf('require(') === 0) {
            let result = resolveRequirePath(attr.val, attr.filename, webpackResolveAlias);
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
  const loaderContext = this,
    loaderOptions = loaderContext.getOptions() || {},
    filename = loaderContext.resourcePath;

  if (!callback) callback = loaderContext.callback;

  // resolve.alias from webpack config, see https://webpack.js.org/api/loaders/#this_compiler
  webpackResolveAlias = loaderContext._compiler.options.resolve.alias || {};
  loaderContext.cacheable && loaderContext.cacheable(true);

  const options = {
    // used to resolve imports/extends and to improve errors
    filename: filename,
    // The root directory of all absolute inclusion. Defaults is /.
    //basedir: basedir,
    basedir: '/',
    doctype: loaderOptions.doctype || 'html',
    /** @deprecated This option is deprecated and must be false, see https://pugjs.org/api/reference.html#options */
    pretty: false,
    filters: loaderOptions.filters,
    self: loaderOptions.self || false,
    // Output compiled function to stdout. Must be false.
    debug: false,
    // Include the function source in the compiled template. Defaults is false.
    compileDebug: loaderOptions.debug || false,
    globals: ['require', ...(loaderOptions.globals || [])],
    // Load all requires as function. Must be true.
    inlineRuntimeFunctions: true,
    // default name of template function is `template`
    name: 'template',
    // Use cache file as module. This is not a documented option, but very important, see in pug source. Must be true.
    module: true,
    plugins: [resolvePlugin, ...(loaderOptions.plugins || [])],
  };

  let res;

  try {
    /** @type {{body: string, dependencies: []}} */
    res = pug.compileClientWithDependenciesTracked(content, options);
  } catch (exception) {
    // watch files in which an error occurred
    loaderContext.addDependency(path.normalize(exception.filename));
    // show original error
    callback(exception);
    return;
  }

  // add dependency files to watch changes
  if (res.dependencies) {
    res.dependencies.forEach(loaderContext.addDependency);
  }

  callback(null, res.body);
};

// Asynchronous Loader, see https://webpack.js.org/api/loaders/#asynchronous-loaders
module.exports = function (content, map, meta) {
  const callback = this.async();
  compilePugContent.call(this, content, function (err, result) {
    if (err) return callback(err);
    callback(null, result, map, meta);
  });
};

// exports for test
module.exports.regexpAlias = regexpAlias;
module.exports.resolveAlias = resolveAlias;
module.exports.resolveRequirePath = resolveRequirePath;
