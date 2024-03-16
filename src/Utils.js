const path = require('path');
const { merge } = require('webpack-merge');
const { green, red, yellow } = require('ansis');

const loaderName = 'pug-loader';

const labelInfo = (label) => `\n${green`[${loaderName}${label ? ':' + label : ''}]`}`;
const labelWarn = (label) => `\n${yellow`[${loaderName}${label ? ':' + label : ''}]`}`;
const labelError = (label) => `\n${red`[${loaderName}${label ? ':' + label : ''}]`}`;

const isWin = path.sep === '\\';

const isJSON = (str) => typeof str === 'string' && str.length > 1 && str[0] === '{' && str[str.length - 1] === '}';

const parseValue = (value) => (isJSON(value) ? JSON.parse(value) : value == null ? '' : decodeURIComponent(value));

const outToConsole = (...args) => process.stdout.write(args.join(' ') + '\n');

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

let hmrFile = path.join(__dirname, 'hmr.js');
if (isWin) hmrFile = pathToPosix(hmrFile);

const scriptExtensionRegexp = /\.js[a-z\d]*$/i;
const isRequireableScript = (file) => !path.extname(file) || scriptExtensionRegexp.test(file);

/**
 * Whether request contains the `inline` query param.
 *
 * @param {string} request
 * @return {boolean}
 */
const isInline = (request) => {
  const [, query] = request.split('?', 2);

  return query != null && /(?:^|&)inline(?:$|&)/.test(query);
};

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

  return parseQuery(query.slice(1));
};

/**
 * Stringify JSON data.
 *
 * @note The quality of function source code defined in the data limited by function.toString().
 *   See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/toString
 *   TODO: for complex data structure should be implemented ideas from https://github.com/yahoo/serialize-javascript/blob/main/index.js
 *
 * @param {Object} data The JSON data.
 * @return {string}
 */
const stringifyJSON = (data) => {
  const quoteMark = '__REMOVE_QUOTE__';
  let hasQuoteMarks = false;

  let json = JSON.stringify(data, (key, value) => {
    if (typeof value === 'function') {
      value = value.toString().replace(/\n/g, '');

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

  return hasQuoteMarks
    ? // remove the quotes around the function body
    json.replace(/("__REMOVE_QUOTE__|__REMOVE_QUOTE__")/g, '')
    : json || '{}';
};

/**
 * Remove indents in Vue and React templates.
 *
 * For example, the content of this template contain the indent:
 * <template lang='pug'>
 *   p text
 * </template>
 *
 * In Pug code the indent is not allowed and will be removed.
 * Supports for both spaces and tabs.
 *
 * @param {string} content The Pug code.
 * @returns {boolean|string} If no indent found return false otherwise return normalized code.
 */
const trimIndent = (content) => {
  const SPACE = ' ';
  const TAB = '\t';
  const NL = '\n';

  // skip new lines, tabs and spaces at begin
  let codePos = 0;
  while (content[codePos] === TAB || content[codePos] === SPACE || content[codePos] === NL) {
    codePos++;
  }

  // find `start of line` pos at code line
  let startLinePos = codePos;
  while (startLinePos > 0 && content[--startLinePos] !== NL) {}
  if (content[startLinePos] === NL) startLinePos++;

  const indentSize = codePos - startLinePos;
  const indentCode = content[startLinePos] === TAB ? '\u0009' : '\u0020';

  if (indentSize > 0) {
    const regexp = new RegExp(`^${indentCode}{${indentSize}}`, 'mg');
    return content.replace(regexp, '');
  }

  return false;
};

/**
 * Resolve absolute path to node module main file what can be dynamically required anywhere in code.
 *
 * @param {string} moduleName The resolving module name.
 * @param {string} context The current working directory where is the node_modules folder.
 * @return {string | false} If module exists return resolved module path otherwise false.
 * @throws
 */
const resolveModule = (moduleName, context = process.cwd()) => {
  let moduleFile;
  try {
    moduleFile = require.resolve(moduleName, { paths: [process.cwd()] });
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      return false;
    }
    throw error;
  }

  return moduleFile;
};

module.exports = {
  loaderName,
  labelInfo,
  labelWarn,
  labelError,
  outToConsole,
  hmrFile,
  isRequireableScript,
  isWin,
  isInline,
  pathToPosix,
  getQueryData,
  stringifyJSON,
  trimIndent,
  resolveModule,
};
