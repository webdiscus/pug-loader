const path = require('path');
const ansis = require('ansis');
const adapter = require('./highlight/adapter');

const { loaderName } = require('../utils');
const filterName = 'markdown';
const moduleName = 'markdown-it';
const labelError = `\n${ansis.black.bgRedBright(`[${loaderName}:${filterName}]`)}`;

let modulePath = '';
try {
  modulePath = require.resolve(moduleName, { paths: [process.cwd()] });
  if (modulePath) {
    modulePath = path.dirname(modulePath);
  }
} catch (error) {
  const message = error.toString();
  if (message.indexOf('Cannot find module') >= 0) {
    throw new Error(
      `\n${labelError} The required ${ansis.red(moduleName)} module not found.\n` +
        `Please install the module: ${ansis.cyan(`npm i --save-dev ${moduleName}`)}`
    );
  }
  throw new Error(`\n${labelError} Error by require the ${ansis.red(moduleName)} module.\n` + error);
}

const MarkdownIt = require(modulePath);

/**
 * Embedded filter markdown.
 * @singleton
 */
const filter = {
  name: filterName,
  module: null,
  langPrefix: '',

  /**
   * Initialize the filter.
   *
   * @param {boolean} verbose Display in console warnings and highlighting info.
   *  When a code is not highlighted enable it to show possible warnings by using not supported languages.
   * @param {{use: string, verbose: boolean} | null} highlight The name of a using highlight npm module. The module must be installed.
   * @param {string} langPrefix CSS language prefix for fenced blocks of code. Can be useful for external highlighters.
   *  Use this option only if used external highlighters on frontend, in browser.
   *  If the option {highlight: {use: '...'}} is used then langPrefix is ignored.
   * @public
   * @api
   */
  init({ highlight, langPrefix }) {
    if (this.module != null) return;

    let options = {
      // enable HTML tags in markdown source
      html: true,
    };

    if (highlight != null && highlight.use) {
      adapter.init({
        verbose: highlight.verbose === true,
        use: highlight.use,
      });

      langPrefix = adapter.getLangPrefix();
      options.highlight = (text, lang) => {
        return `<pre class="${langPrefix}${lang}"><code>` + adapter.highlight(text, lang) + '</code></pre>';
      };
    } else if (langPrefix) {
      options.highlight = (text, lang) => {
        return `<pre class="${langPrefix}${lang}"><code>` + text + '</code></pre>';
      };
    }

    this.module = new MarkdownIt(options);
  },

  /**
   * Apply the filter.
   *
   * @param {string} text
   * @returns {string}
   * @public
   * @api
   */
  apply(text) {
    return this.module.render(text);
  },
};

module.exports = filter;
