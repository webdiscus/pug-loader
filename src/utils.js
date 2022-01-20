const path = require('path');
const { merge } = require('webpack-merge');

const loaderName = 'pug-loader';

const isWin = path.sep === '\\';
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
 * Converts the win path to POSIX standard.
 * The require() function understands only POSIX format.
 *
 * Fix path, for example:
 *   - `..\\some\\path\\file.js` to `../some/path/file.js`
 *   - `C:\\some\\path\\file.js` to `C:/some/path/file.js`
 *
 * @param {string} value The path on Windows.
 * @return {*}
 */
const pathToPosix = (value) => value.replace(/\\/g, '/');

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
  loaderName,
  isWin,
  pathToPosix,
  getResourceParams,
  injectExternalVariables,
};
