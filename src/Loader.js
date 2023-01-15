const { merge } = require('webpack-merge');
const { getQueryData, isWin, pathToPosix } = require('./Utils');
const HtmlMethod = require('./methods/HtmlMethod');
const RenderMethod = require('./methods/RenderMethod');
const CompileMethod = require('./methods/CompileMethod');

class Loader {
  static compiler = null;
  static methods = [
    {
      method: 'compile',
      query: 'pug-compile',
    },
    {
      method: 'render',
      query: 'pug-render',
    },
    {
      method: 'html',
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
    const { data, esModule, method, name: templateName, self: useSelf } = options;

    // the rule: a query method override a global method defined in the loader options
    const queryData = getQueryData(resourceQuery);

    this.compiler = this.compilerFactory({
      method,
      templateFile,
      templateName,
      queryData,
      esModule,
      isPlugin,
      useSelf,
    });

    // remove method from query data to pass in the template only clean data
    const query = this.compiler.query;
    if (queryData.hasOwnProperty(query)) {
      delete queryData[query];
    }

    this.data = merge(data || {}, customData || {}, queryData);
  }

  /**
   * Create instance by compilation method.
   *
   * Note:
   *  - if pug-loader is used standalone, then default method is `compile` for compatibility with pugjs/pug-loader
   *  - if pug-loader used with pug-plugin, default method is `render`
   *
   * @param {string} method
   * @param {string} templateFile
   * @param {string} templateName
   * @param {Object} queryData
   * @param {boolean} esModule
   * @param {boolean} isPlugin
   * @param {boolean} useSelf Whether the `self` option is true.
   * @return {CompileMethod|RenderMethod|HtmlMethod}
   */
  static compilerFactory({ method, templateFile, templateName, queryData, esModule, isPlugin, useSelf }) {
    const methodFromQuery = this.methods.find((item) => queryData.hasOwnProperty(item.query));
    const methodFromOptions = this.methods.find((item) => method === item.method);

    // default method
    let methodName = isPlugin ? 'render' : 'compile';
    if (methodFromQuery) {
      methodName = methodFromQuery.method;
    } else if (methodFromOptions) {
      methodName = methodFromOptions.method;
    }

    switch (methodName) {
      case 'compile':
        return new CompileMethod({ templateFile, templateName, esModule, useSelf });
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

    // in value replace all `require` with handler name depend on a method
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
