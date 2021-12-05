const path = require('path');
const { merge } = require('webpack-merge');

const isJSON = (str) => typeof str === 'string' && str.length > 1 && str[0] === '{' && str[str.length - 1] === '}';
const parseValue = (value) => (isJSON(value) ? JSON.parse(value) : value == null ? '' : value);

/**
 * Parse the resourceQuery of the Loader Context.
 * See possible resource queries in the test case `parse resource data`.
 *
 * @param {string} query
 * @return {{}}
 */
const parseResourceData = function (query) {
  let params = query.split('&'),
    data = {};

  params.forEach((param) => {
    if (isJSON(param)) {
      const val = JSON.parse(param);
      data = merge(data, val);
      return;
    }

    let [key, val] = param.split('=');
    if (key.indexOf('[]') > 0) {
      key = key.replace('[]', '');
      if (!data.hasOwnProperty(key)) data[key] = [];
      data[key].push(parseValue(val));
    } else if (key && key.length > 0) {
      data[key] = parseValue(val);
    }
  });

  return data;
};

/**
 * Get data from the resource query.
 *
 * @param {string} str
 * @return {{}}
 */
const getResourceParams = function (str) {
  if (str[0] !== '?') return {};
  const query = str.substr(1);

  return parseResourceData(query);
};

/**
 * @param {string} match The matched alias.
 * @return {string} The regex pattern with matched aliases.
 */
const regexpAlias = (match) => `^[~@]?(${match})(?=\\/)`;

/**
 * Replace founded alias in require argument.
 *
 * @param {string} value The value of extends/include/require().
 * @param {{}} aliases The `resolve.alias` of webpack config.
 * @param {function(string):string} regexp The function return a regex pattern string. The argument is alias name.
 * @return {string} The string with replaced alias.
 */
const resolveAlias = (value, aliases, regexp) => {
  const patternAliases = Object.keys(aliases).join('|');

  if (!patternAliases) return value;

  const [, alias] = new RegExp(regexp(patternAliases)).exec(value) || [];

  return alias ? value.replace(new RegExp(regexp(alias)), aliases[alias]).replace('//', '/') : value;
};

/**
 * Resolve a path in pug template.
 *
 * @param {string} value value The value of extends/include.
 * @param {{}} aliases The `resolve.alias` of webpack config.
 * @return {string}
 */
const resolveTemplatePath = (value, aliases) => resolveAlias(value, aliases, regexpAlias);

/**
 * Resolve a path in the argument of require() function.
 *
 * @param {string} templateFile The filename of the template where resolves the resource.
 * @param {string} value The resource value include require().
 * @param {{}} aliases The resolve.alias from webpack config.
 * @param {LoaderMethod} method The object of the current method.
 * @return {string|null}
 */
const resolveResourcePath = function (templateFile, value, aliases, method) {
  // match an argument of require(sourcePath)
  const [, sourcePath] = /(?<=require\()(.+)(?=\))/.exec(value) || [];
  if (!sourcePath) return value;

  // 1. delete `./` from path, because at begin will be added full path like `/path/to/current/dir/`
  let resourcePath = sourcePath.replace(/(?<=[^\.])(\.\/)/, '');

  // 2. replace alias with absolute path
  // todo Fix usage prefixes ~@, e.g. img(src=require('~Images/image.jpeg')) not found!
  let resolvedPath = resolveAlias(resourcePath, aliases, (match) => `(?<=["'\`])(${match})(?=\/)`);

  // 3. if the alias is not found in the path,
  // then add the absolute path of the current template at the beginning of the argument,
  // e.g. like this require('/path/to/template/' + 'filename.jpeg')
  if (resolvedPath === resourcePath) {
    // 4. if an argument of require() begin with a relative parent path as the string template with a variable,
    // like require(`../images/${file}`), then extract the relative path to the separate string
    if (resourcePath.indexOf('`../') === 0) {
      const relPathRegex = /(?<=`)(.+)(?=\$\{)/;
      const [, relPath] = relPathRegex.exec(value);
      if (relPath) {
        resourcePath = `'${relPath}' + ` + resourcePath.replace(relPathRegex, '');
      }
    }
    resolvedPath = `'${path.dirname(templateFile)}/' + ${resourcePath}`;
  }

  return method.requireResource(resolvedPath);
};

/**
 * Inject external variables from the resource query, from the loader options
 * and merge them variables with the `locals` variable.
 *
 * @param {string} funcBody The function as string.
 * @param {{}} locals The object of template variables.
 * @return {string}
 */
const injectExternalVariables = (funcBody, locals) =>
  'var __external_locals__ = ' +
  JSON.stringify(locals) +
  `;\n` +
  funcBody.replace(/(?<=locals_for_with = )(?:\(locals \|\| {}\))(?=;)/, 'Object.assign(__external_locals__, locals)');

module.exports = {
  getResourceParams,
  resolveTemplatePath,
  resolveResourcePath,
  injectExternalVariables,
};
