const ansis = require('ansis');
const parser = require('./parser');

/**
 * The adapter (bridge, wrapper) provide one interface for different highlighting modules
 * such as `prismjs` or `highlight.js`.
 *
 * @singleton
 */

const adapter = {
  verbose: false,
  module: null,
  supportedModules: new Set([
    'prismjs',
    //'highlight.js', // reserved for next release
  ]),

  /**
   * @param {boolean} [verbose=false] Enable output info in console.
   * @param {string} moduleName The name of npm module.
   * @public
   * @api
   */
  init({ verbose = false, use: moduleName }) {
    if (this.module != null) return;
    this.verbose = verbose === true;

    const label = 'highlight adapter';
    const labelError = `\n${ansis.black.bgRedBright(`[${label}]`)}`;

    if (!moduleName || !this.supportedModules.has(moduleName)) {
      const error =
        `\n${labelError} Used unsupported module ${ansis.cyan(moduleName)}.\n` +
        `Supported modules: ` +
        ansis.green(this.getNamesOfSupportedModules().join(', ')) +
        '.';
      throw new Error(error);
    }

    const modulePath = `./${moduleName.replace(/\./g, '')}.js`;
    this.module = require(modulePath);
    this.module.init({ verbose: this.verbose });

    parser.init({
      langPrefix: this.getLangPrefix(),
    });

    // override the abstract highlight method
    parser.highlight = this.module.highlight.bind(this.module);
  },

  /**
   * @returns {boolean}
   * @public
   * @api
   */
  isInitialized() {
    return this.module != null;
  },

  /**
   * Whether the highlighting module is supported.
   *
   * @param {string} moduleName
   * @returns {boolean}
   * @public
   * @api
   */
  isSupported(moduleName) {
    return this.supportedModules.has(moduleName);
  },

  /**
   * @returns {string[]}
   * @public
   * @api
   */
  getNamesOfSupportedModules() {
    return Array.from(this.supportedModules);
  },

  /**
   * @returns {string}
   * @public
   * @api
   */
  getLangPrefix() {
    return this.module.getLangPrefix();
  },

  /**
   * Highlight a code by the language.
   *
   * @param {string} text
   * @param {string | null} language
   * @returns {string}
   * @public
   * @api
   */
  highlight(text, language) {
    return this.module.highlight(text, language);
  },

  /**
   * Autodetect language in code and highlight all founded codes.
   *
   * @param {string} text
   * @returns {string}
   * @public
   * @api
   */
  highlightAll(text) {
    return parser.highlightAll(text);
  },
};

module.exports = adapter;
