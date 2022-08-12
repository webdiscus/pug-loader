const { merge } = require('webpack-merge');
const { getQueryData, isWin, pathToPosix } = require('./Utils');
const HtmlMethod = require('./methods/HtmlMethod');
const RenderMethod = require('./methods/RenderMethod');
const CompileMethod = require('./methods/CompileMethod');

/**
 * @singleton
 */
class Loader {
  method = null;
  methods = [
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
   * @param {string} filename The pug template file.
   * @param {string} resourceQuery The URL query of template.
   * @param {{}} options The loader options.
   * @param {{}} customData The custom data.
   * @param {boolean} isPlugin Whether the pug-loader work under pug-plugin.
   */
  init({ filename: templateFile, resourceQuery, options, customData, isPlugin }) {
    const { data, esModule, method, name: templateName } = options;

    // the rule: a method defined in the resource query has the highest priority over a method defined in the loaderName options
    // because a method from loaderName options is global but a query method override a global method
    const queryData = getQueryData(resourceQuery);

    this.method = this.methodFactory({ method, templateFile, templateName, queryData, esModule, isPlugin });

    // remove pug method from query data to pass in pug only clean data
    if (queryData.hasOwnProperty(this.method.query)) {
      delete queryData[this.method.query];
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
   * @return {CompileMethod|RenderMethod|HtmlMethod}
   */
  methodFactory({ method, templateFile, templateName, queryData, esModule, isPlugin }) {
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
  resolveResource(value, templateFile) {
    const method = this.method;
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
      const replacement = method.require(file, templateFile);

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
  resolveScript(value, templateFile) {
    const [, file] = /require\((.+?)(?=\))/.exec(value) || [];
    if (isWin) templateFile = pathToPosix(templateFile);

    return this.method.requireScript(file, templateFile);
  }

  /**
   * Resolve style file in the link tag.
   *
   * @param {string} value
   * @param {string} templateFile
   * @return {string}
   */
  resolveStyle(value, templateFile) {
    const [, file] = /require\((.+?)(?=\))/.exec(value) || [];
    if (isWin) templateFile = pathToPosix(templateFile);

    return this.method.requireStyle(file, templateFile);
  }

  /**
   * Export generated result.
   *
   * @param {string} source
   * @return {string}
   */
  export(source) {
    return this.method.export(source, this.data);
  }

  /**
   * Export code with error message.
   *
   * @param {Error} error
   * @param {Function} getErrorMessage
   * @return {string}
   */
  exportError(error, getErrorMessage) {
    return this.method.exportError(error, getErrorMessage);
  }
}

module.exports = new Loader();
