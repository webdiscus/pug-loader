/**
 * The `:highlight` filter highlights code syntax.
 *
 * Usage:
 *
 *  pre: code
 *    :highlight(html)
 *      <a href="home.html">Home</a>
 */

// Add the filter `highlight` in the options of pug loader:
// {
//   test: /\.pug$/,
//   loader: '@webdiscus/pug-loader',
//   options: {
//     embedFilters: {
//       highlight: {
//         verbose: true, // output process info in console
//         use: '<MODULE_NAME>', // currently is supported the `prismjs` only
//       },
//     },
//   },
// },

const { green, cyan } = require('ansis');
const { labelError } = require('../Utils');
const adapter = require('./highlight/adapter');

const filterName = 'highlight';
const filterLabelError = labelError(filterName);

// for usage the `[]` chars in pug inline filter, the chars must be written as HTML entity
// e,g. the `#[:highlight(js) const arr = [1, 2];]` must be as `#[:highlight(js) const arr = &lbrack;1, 2&rbrack;;]`,
// but for tokenize is needed to decode HTML entities in normal chars
const reservedChars = /&lbrack;|&rbrack;/g;
const charReplacements = {
  '&lbrack;': '[',
  '&rbrack;': ']',
};

/**
 * Embedded filter highlight.
 * @singleton
 */
const filter = {
  name: filterName,
  verbose: false,

  /**
   * Initialize the filter.
   *
   * @param {boolean} verbose Display in console warnings and highlighting info.
   *  When a code is not highlighted enable it to show possible warnings by using not supported languages.
   * @param {string} use The name of a using highlight npm module. The module must be installed.
   * @public
   * @api
   */
  init({ verbose, use: moduleName }) {
    if (adapter.isInitialized()) return;

    this.verbose = verbose === true;

    if (!moduleName || !adapter.isSupported(moduleName)) {
      const error =
        `\n${filterLabelError} In webpack config is used unsupported highlight module ${cyan(moduleName)}.\n` +
        `Supported modules: ` +
        green(adapter.getNamesOfSupportedModules().join(', ')) +
        '.';
      throw new Error(error);
    }

    adapter.init({
      verbose: this.verbose,
      use: moduleName,
    });
  },

  /**
   * Apply the filter.
   *
   * @param {string} text
   * @param {{language: {string}, value: {any}}} options
   * @returns {string}
   * @public
   * @api
   */
  apply(text, options) {
    let [language] = Object.keys(options);

    // if first item of options is `filename` then no language was defined in filter
    language = language !== 'filename' ? language.toLowerCase() : null;

    // supports for `[]` chars in pug inline filter
    text = text.replace(reservedChars, (str) => charReplacements[str]);

    return language ? adapter.highlight(text, language) : adapter.highlightAll(text);
  },
};

module.exports = filter;
