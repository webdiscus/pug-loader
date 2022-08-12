const path = require('path');
const ansis = require('ansis');
const { outToConsole } = require('../../Utils');

const label = 'prismjs';
const labelInfo = `\n${ansis.black.bgGreen(`[${label}]`)}`;
const labelWarn = `\n${ansis.black.bgYellow(`[${label}]`)}`;
const labelError = `\n${ansis.black.bgRedBright(`[${label}]`)}`;

const prismjs = {
  name: 'prismjs',
  prefix: 'language-',
  verbose: false,
  module: null,
  modulePath: null,
  supportedLanguages: new Set(),
  loadedLanguages: new Set(),

  /**
   * @param {boolean} [verbose=false] Enable output info in console.
   * @public
   * @api
   */
  init({ verbose = false }) {
    if (this.module != null) return;

    const moduleName = this.name;
    this.verbose = verbose;

    try {
      const modulePath = require.resolve(moduleName, { paths: [process.cwd()] });
      if (modulePath) {
        this.modulePath = path.dirname(modulePath);
      }
      // import Prism module
      this.module = require(this.modulePath);
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

    // init language loader
    this.components = require(path.join(this.modulePath, 'components.js'));
    this.getLoader = require(path.join(this.modulePath, 'dependencies.js'));

    // generate list of supported languages
    const languages = this.components.languages;
    for (let lang in languages) {
      if (lang === 'meta') continue;
      const alias = languages[lang].alias;
      this.supportedLanguages.add(lang);
      if (alias) {
        Array.isArray(alias)
          ? alias.forEach(this.supportedLanguages.add, this.supportedLanguages)
          : this.supportedLanguages.add(alias);
      }
    }
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
   * @returns {string}
   * @public
   * @api
   */
  getLangPrefix() {
    return this.prefix;
  },

  /**
   * @param {string} text
   * @param {string} language
   * @returns {string}
   * @public
   * @api
   */
  highlight(text, language) {
    const Prism = this.module;
    language = language.toLowerCase();

    if (!language) return text;

    // lazy load a language
    if (!Prism.languages.hasOwnProperty(language)) {
      if (this.loadLanguage(language) === false) {
        // if the language is not supported bypass original text
        return text;
      }
    }

    return Prism.highlight(text, Prism.languages[language], language);
  },

  /**
   * @param {string} language
   * @private
   */
  loadLanguage(language) {
    if (!this.supportedLanguages.has(language)) {
      if (this.verbose) {
        outToConsole(`${labelWarn} Unsupported language '${ansis.red(language)}' is ignored!\n`);
      }
      return false;
    }

    const Prism = this.module;
    let { components, loadedLanguages, getLoader, modulePath } = this;

    // the user might have loaded languages via some other way or used `prism.js` which already includes some
    // we don't need to validate the ids because `getLoader` will ignore invalid ones
    const loaded = [...loadedLanguages, ...Object.keys(Prism.languages)];

    if (this.verbose) {
      outToConsole(`${labelInfo} Load language ${ansis.cyan(language)}`);
    }

    getLoader(components, [language], loaded).load((lang) => {
      if (!loadedLanguages.has(lang)) {
        const pathToLanguage = path.join(modulePath, 'components/prism-' + lang + '.min.js');
        loadedLanguages.add(lang);

        // remove from require cache and from Prism
        delete require.cache[pathToLanguage];
        delete Prism.languages[lang];

        if (this.verbose && language !== lang) {
          outToConsole(` - load dependency ${ansis.cyan(lang)}`);
        }

        require(pathToLanguage);
      }
    });

    return true;
  },
};

module.exports = prismjs;
