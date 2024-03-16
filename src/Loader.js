const { merge } = require('webpack-merge');
const { getQueryData, isWin, pathToPosix } = require('./Utils');
const HtmlMethod = require('./methods/HtmlMethod');
const RenderMethod = require('./methods/RenderMethod');
const CompileMethod = require('./methods/CompileMethod');

class Loader {
  static compiler = null;
  static modes = [
    {
      mode: 'compile',
      query: 'compile',
    },
    {
      mode: 'render',
      query: 'render',
    },
    {
      mode: 'html',
      query: 'html',
    },
    // DEPRECATED: instead of `?pug-compile` use `?compile` query
    {
      mode: 'compile',
      query: 'pug-compile',
    },
    // DEPRECATED: instead of `?pug-render` use `?render` query
    {
      mode: 'render',
      query: 'pug-render',
    },
    // DEPRECATED: instead of `?pug-html` use `?html` query
    {
      mode: 'html',
      query: 'pug-html',
    },
  ];

  /**
   * @param {string} filename The template file.
   * @param {string} resourceQuery The URL query of template.
   * @param {{}} options The loader options.
   * @param {{}} customData The custom data.
   * @param {boolean} isPlugin Whether the loader work under the plugin.
   */
  static init({ filename: templateFile, resourceQuery, options, customData, isPlugin }) {
    let { data, esModule, method, mode, name: templateName } = options;

    // TODO: the `method` option is DEPRECATED, use instead it the `mode` option, delete `method` option in v.4.0
    if (!mode) mode = method;

    // the rule: a query method override a global method defined in the loader options
    const queryData = getQueryData(resourceQuery);

    this.compiler = this.compilerFactory({
      mode,
      templateFile,
      templateName,
      queryData,
      esModule,
      isPlugin,
    });

    // remove mode from query data to pass in the template only clean data
    const query = this.compiler.query;
    if (queryData.hasOwnProperty(query)) {
      delete queryData[query];
    }

    this.data = merge(data || {}, customData || {}, queryData);
  }

  /**
   * Create instance by compilation mode.
   *
   * Note:
   *  - if pug-loader is used standalone, then default mode is `compile` for compatibility with pugjs/pug-loader
   *  - if pug-loader used with pug-plugin, default mode is `render`
   *
   * @param {string} mode
   * @param {string} templateFile
   * @param {string} templateName
   * @param {Object} queryData
   * @param {boolean} esModule
   * @param {boolean} isPlugin
   * @return {CompileMethod|RenderMethod|HtmlMethod}
   */
  static compilerFactory({ mode, templateFile, templateName, queryData, esModule, isPlugin }) {
    const modeFromQuery = this.modes.find((item) => queryData.hasOwnProperty(item.query));
    const modeFromOptions = this.modes.find((item) => mode === item.mode);

    // default mode
    let modeName = isPlugin ? 'render' : 'compile';
    if (modeFromQuery) {
      modeName = modeFromQuery.mode;
    } else if (modeFromOptions) {
      modeName = modeFromOptions.mode;
    }

    switch (modeName) {
      case 'compile':
        return new CompileMethod({ templateFile, templateName, esModule });
      case 'render':
        return new RenderMethod({ templateFile, templateName, esModule });
      case 'html':
        return new HtmlMethod({ templateFile, templateName });
      default:
        break;
    }
  }

  /**
   * Resolve resource file in a tag attribute.
   *
   * @param {string} value The resource value or code included require().
   * @param {string} templateFile The filename of the template where resolves the resource.
   * @return {string}
   */
  static resolveResource(value, templateFile) {
    const compiler = this.compiler;
    const openTag = 'require(';
    const openTagLen = openTag.length;
    let pos = value.indexOf(openTag);

    if (pos < 0) return value;

    let lastPos = 0;
    let result = '';
    let char;

    if (isWin) templateFile = pathToPosix(templateFile);

    // in value replace all `require` with handler name depend on a mode
    while (~pos) {
      let startPos = pos + openTagLen;
      let endPos = startPos;
      let opened = 1;

      do {
        char = value[++endPos];
        if (char === '(') opened++;
        else if (char === ')') opened--;
      } while (opened > 0 && char != null && char !== '\n' && char !== '\r');

      if (opened > 0) {
        throw new Error('[pug-loader] parse error: check the `(` bracket, it is not closed at same line:\n' + value);
      }

      const file = value.slice(startPos, endPos);
      const replacement = compiler.require(file, templateFile);

      result += value.slice(lastPos, pos) + replacement;
      lastPos = endPos + 1;
      pos = value.indexOf(openTag, lastPos);
    }

    if (value.length - 1 > pos + openTagLen) {
      result += value.slice(lastPos);
    }

    return result;
  }

  /**
   * Resolve script file in the script tag.
   *
   * @param {string} value
   * @param {string} templateFile
   * @return {string}
   */
  static resolveScript(value, templateFile) {
    const [, file] = /require\((.+?)(?=\))/.exec(value) || [];
    if (isWin) templateFile = pathToPosix(templateFile);

    return this.compiler.requireScript(file, templateFile);
  }

  /**
   * Resolve style file in the link tag.
   *
   * @param {string} value
   * @param {string} templateFile
   * @return {string}
   */
  static resolveStyle(value, templateFile) {
    const [, file] = /require\((.+?)(?=\))/.exec(value) || [];
    if (isWin) templateFile = pathToPosix(templateFile);

    return this.compiler.requireStyle(file, templateFile);
  }

  /**
   * Export generated result.
   *
   * @param {string} source
   * @return {string}
   */
  static export(source) {
    return this.compiler.export(source, this.data);
  }

  /**
   * Export code with error message.
   *
   * @param {Error} error
   * @param {Function} getErrorMessage
   * @return {string}
   */
  static exportError(error, getErrorMessage) {
    return this.compiler.exportError(error, getErrorMessage);
  }
}

module.exports = Loader;
