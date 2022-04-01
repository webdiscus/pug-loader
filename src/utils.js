const path = require('path');
const { merge } = require('webpack-merge');
const vm = require('vm');

const loaderName = 'pug-loader';

const isWin = path.sep === '\\';

const isJSON = (str) => typeof str === 'string' && str.length > 1 && str[0] === '{' && str[str.length - 1] === '}';

const parseValue = (value) => (isJSON(value) ? JSON.parse(value) : value == null ? '' : value);

const outToConsole = (...args) => process.stdout.write(args.join(' ') + '\n');

/**
 * Parse the url query.
 * See possible resource queries in the test case `parse resource data`.
 *
 * @param {string} query
 * @return {{}}
 */
const parseQuery = function (query) {
  let params = query.split('&'),
    data = {};

  params.forEach((param) => {
    if (isJSON(param)) {
      const value = JSON.parse(param);
      data = merge(data, value);
      return;
    }

    let [key, value] = param.split('=');
    if (key.indexOf('[]') > 0) {
      key = key.replace('[]', '');
      if (!data.hasOwnProperty(key)) data[key] = [];
      data[key].push(parseValue(value));
    } else if (key && key.length > 0) {
      data[key] = parseValue(value);
    }
  });

  return data;
};

/**
 * Get data from the resource query.
 *
 * @param {string} query
 * @return {{}}
 */
const getQueryData = function (query) {
  if (query[0] !== '?') return {};

  return parseQuery(query.substring(1));
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
 * @note The quality of source code of a function defined in the locals limited by function.toString().
 *   See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/toString
 *   If needed 100% working js function passed via loader option `data`, use loader `render` method.
 *
 * @param {string} funcBody The function as string.
 * @param {{}} locals The object of template variables.
 * @return {string}
 */
const injectExternalData = (funcBody, locals) => {
  const quoteMark = '__REMOVE_QUOTE__';
  let hasQuoteMarks = false;

  let localsString = JSON.stringify(locals, (key, value) => {
    if (typeof value === 'function') {
      value = value.toString().replaceAll('\n', '');

      // transform `{ fn() {} }` to `{ fn: () => {} }`
      const keySize = key.length;
      if (key === value.slice(0, keySize)) {
        const pos = value.indexOf(')', keySize + 1) + 1;
        value = value.slice(keySize, pos) + '=>' + value.slice(pos);
      }

      value = quoteMark + value + quoteMark;
      hasQuoteMarks = true;
    }

    return value;
  });

  // remove the quotes around the function body
  if (hasQuoteMarks) {
    localsString = localsString.replaceAll('"' + quoteMark, '').replaceAll(quoteMark + '"', '');
  }

  return (
    'var __external_locals__ = ' +
    localsString +
    `;\n` +
    funcBody.replace(
      /(?<=locals_for_with = )(?:\(locals \|\| {}\))(?=;)/,
      'Object.assign({}, __external_locals__, locals || {})'
    )
  );
};

module.exports = {
  loaderName,
  isWin,
  pathToPosix,
  getQueryData,
  outToConsole,
  injectExternalData,
};
