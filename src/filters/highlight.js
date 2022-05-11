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

const path = require('path');
const ansis = require('ansis');
const parse5 = require('parse5');

const { loaderName } = require('../utils');
const filterName = 'highlight';
const ansisLoaderName = `\n${ansis.black.bgGreen(`[${loaderName}]`)}${ansis.white.inverse(`:${filterName}`)}`;
const ansisLoaderNameWarn = `\n${ansis.black.bgYellow(`[${loaderName}]`)}${ansis.white.inverse(`:${filterName}`)}`;
const ansisLoaderNameError = `\n${ansis.black.bgRedBright(`[${loaderName}]`)}${ansis.white.inverse(`:${filterName}`)}`;

const parser = {
  entries: {},
  entryIndex: 0,
  classNamePrefix: '',

  /**
   * @param {string} text
   * @param {string} language
   * @returns {string}
   * @abstract The abstract method must be overridden with adapter method.
   */
  highlight(text, language) {
    throw new Error('You have to implement the abstract method highlight().');
  },

  /**
   * @param {string} text
   * @returns {string}
   */
  highlightAll(text) {
    const document = parse5.parseFragment(text);
    this.entryIndex = 0;
    this.entries = {};

    // auto detect code in document and save highlighted code in entries
    this.walk(document);

    // text contains marked placeholders which must be replaced with highlighted code from entries
    text = parse5.serialize(document);
    for (let marker in this.entries) {
      text = text.replace(marker, this.entries[marker]);
    }

    return text;
  },

  /**
   * @param {{name: string, value: string}[]} attrs The node attributes.
   * @returns {string}
   * @private
   */
  getLanguage(attrs) {
    let lang = '';

    if (attrs != null) {
      const attr = attrs.find(
        (item) =>
          item.name === 'class' && (item.value.startsWith(this.classNamePrefix) || item.value.startsWith('lang-'))
      );

      if (attr) {
        lang = attr.value.replace(this.classNamePrefix, '').replace('lang-', '');
      }
    }

    return lang;
  },

  /**
   * @param {{attrs: {name: string, value: string}[]}} node The node
   * @param {string} lang
   * @private
   */
  setLanguage(node, lang) {
    const attrClass = node.attrs.find((item) => item.name === 'class');
    const className = this.classNamePrefix + lang;

    if (attrClass) {
      let classes = attrClass.value.split(' ').filter((item) => !item.startsWith(this.classNamePrefix));
      classes.push(className);
      attrClass.value = classes.join(' ');
    } else {
      node.attrs.push({ name: 'class', value: className });
    }
  },

  /**
   * Traverse parsed HTML nodes and highlight a code by a detected language.
   *
   * @param {{} | []} obj A traversable object.
   * @private
   */
  walk(obj) {
    for (let key in obj) {
      const node = obj[key];

      if (node.childNodes != null) {
        this.walk(node.childNodes);
      } else if (Array.isArray(node)) {
        this.walk(node);
      }

      if (node.nodeName === '#text') {
        let parentNode = node.parentNode;
        if (parentNode != null && parentNode.nodeName === 'code') {
          // match language in class name of `code` or `pre` tags
          let language = this.getLanguage(parentNode.attrs);
          parentNode = parentNode.parentNode;

          if (parentNode != null && parentNode.nodeName === 'pre') {
            if (language) {
              // set needed class name in <pre> tag
              this.setLanguage(parentNode, language);
            } else {
              language = this.getLanguage(parentNode.attrs);
            }
          }

          if (language) {
            let marker = `__HL_MARKER_${this.entryIndex++}__`;
            this.entries[marker] = this.highlight(node.value, language);
            node.value = marker;
          }
        }
      }
    }
  },
};

const adapter = {
  // highlight.js module is reserved for future
  // 'highlight.js': {
  //   name: 'highlight.js',
  //   prefix: 'hl-',
  //   verbose: false,
  //   module: null,
  //   modulePath: null,
  //   supportedLanguages: new Set(),
  //   loadedLanguages: new Set(),
  //
  //   init({ verbose }) {},
  //
  //   highlight(text, language) {
  //     return text;
  //   },
  //
  //   highlightAll(text) {
  //     return text;
  //   },
  // },

  // prismjs module must be installed
  prismjs: {
    name: 'prismjs',
    // className prefix
    prefix: 'language-',
    verbose: false,
    module: null,
    modulePath: null,
    supportedLanguages: new Set(),
    loadedLanguages: new Set(),

    /**
     * @api
     * @public
     */
    init({ verbose }) {
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
        throw new Error(
          `\n${ansisLoaderNameError} The :highlight filter require the '${moduleName}' module.\n` +
            `Please install the module: npm i --save-dev ${moduleName}` +
            '\n' +
            error
        );
      }

      // define className prefix used by this module
      parser.classNamePrefix = this.prefix;
      // define the abstract highlight method for this module
      parser.highlight = this.highlight.bind(this);

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
     * @param {string} language
     * @private
     */
    loadLanguage(language) {
      if (!this.supportedLanguages.has(language)) {
        if (this.verbose) {
          console.log(`\n${ansisLoaderNameWarn} Unsupported language ${ansis.red(language)} is ignored!`);
        }

        return false;
      }

      const Prism = this.module;
      let { components, loadedLanguages, getLoader, modulePath } = this;

      // the user might have loaded languages via some other way or used `prism.js` which already includes some
      // we don't need to validate the ids because `getLoader` will ignore invalid ones
      const loaded = [...loadedLanguages, ...Object.keys(Prism.languages)];

      if (this.verbose) {
        console.log(`${ansisLoaderName} Load language ${ansis.cyan(language)}`);
      }

      getLoader(components, [language], loaded).load((lang) => {
        if (!loadedLanguages.has(lang)) {
          const pathToLanguage = path.join(modulePath, 'components/prism-' + lang + '.min.js');
          loadedLanguages.add(lang);

          // remove from require cache and from Prism
          delete require.cache[pathToLanguage];
          delete Prism.languages[lang];

          if (this.verbose && language !== lang) {
            console.log(` - load dependency ${ansis.cyan(lang)}`);
          }

          require(pathToLanguage);
        }
      });

      return true;
    },

    /**
     * @param {string} text
     * @param {string} language
     * @returns {string}
     * @api
     * @public
     */
    highlight(text, language) {
      const Prism = this.module;
      language = language.toLowerCase();

      if (!Prism.languages.hasOwnProperty(language)) {
        if (this.loadLanguage(language) === false) {
          // if the language is not supported bypass original text
          return text;
        }
      }

      return Prism.highlight(text, Prism.languages[language], language);
    },

    /**
     * @param {string} text
     * @returns {string}
     * @api
     * @public
     */
    highlightAll(text) {
      return parser.highlightAll(text);
    },
  },
};

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
  modulePath: null,
  module: null,
  supportedModules: new Set([
    'prismjs',
    //'highlight.js', // reserved for next release
  ]),

  /**
   * Initialize the filter.
   *
   * @param {boolean} verbose Display in console warnings and highlighting info.
   *  When a code is not highlighted enable it to show possible warnings by using not supported languages.
   * @param {string} use The name of a using highlight npm module.
   *  The module must be installed in user package.json.
   * @public
   * @api
   */
  init({ verbose, use: moduleName }) {
    this.verbose = verbose === true;

    if (this.module != null) return;

    if (!moduleName || !this.supportedModules.has(moduleName)) {
      const error =
        `\n${ansisLoaderNameError} The unsupported module ${ansis.cyan(moduleName)} is used in webpack config.\n` +
        `The supported modules: ` +
        ansis.green(Array.from(this.supportedModules).join(', ')) +
        '.';
      throw new Error(error);
    }

    this.module = adapter[moduleName];
    this.module.init({ verbose: this.verbose });
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
    const module = this.module;
    let [language] = Object.keys(options);

    // if first item of options is `filename` then no language was defined in filter
    language = language !== 'filename' ? language.toLowerCase() : null;

    // supports for `[]` chars in pug inline filter
    text = text.replace(reservedChars, (str) => charReplacements[str]);

    return language ? module.highlight(text, language) : module.highlightAll(text);
  },
};

module.exports = filter;
