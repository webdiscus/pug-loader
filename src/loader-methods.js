/**
 * @typedef LoaderMethod
 * @property {string} method The compiler export method, defined in loader option.
 * @property {string} queryParam The same as `method`, but defined in resource query parameter.
 * @property {function(string)} requireResource The inject require of resource.
 * @property {function(string, {}, boolean)} output Generates a output content.
 */

const getExportCode = (esModule) => (esModule ? 'export default ' : 'module.exports=');

/**
 * Loader methods to export template function.
 *
 * @type {LoaderMethod[]}
 */
const loaderMethods = [
  {
    // export the compiled template function
    method: 'compile',
    queryParam: 'pug-compile',
    requireResource: (file) => `require(${file})`,
    output: (funcBody, locals, esModule) => funcBody + ';' + getExportCode(esModule) + 'template;',
  },
  {
    // export rendered HTML string at compile time
    method: 'render',
    queryParam: 'pug-render',
    // the result of compiled string must be exact as this:
    //requireResource: (file) => "((file) => `' + require('${file}') + '`)(" + file + ')',
    // to prevent escaping the 'single quotes' they must be as HTML char '&quot;' encoded and at end decoded:
    requireResource: (file) => '((file) => `&quot; + require(&quot;${file}&quot;) + &quot;`)(' + file + ')',
    output: (funcBody, locals, esModule) =>
      getExportCode(esModule) +
      "'" +
      new Function('require', funcBody + ';return template;')(require)(locals)
        .replace(/\n/g, '\\n')
        .replace(/'/g, "\\'")
        .replace(/&amp;quot;/g, "'") +
      "';",
  },
  {
    // export the compiled template function, by require() it will be auto rendered into HTML string at runtime
    // @deprecated, it is reserved only as rescue fallback, after stable release of method `render` will be removed
    method: 'rtRender',
    queryParam: 'pug-rtrender',
    requireResource: (file) => `require(${file})`,
    output: (funcBody, locals, esModule) => funcBody + ';' + getExportCode(esModule) + 'template();',
  },
  {
    // render to pure HTML string at compile time
    // notes:
    //   - this method has not a query parameter for method
    //   - this method should be used with additional loader to handle HTML
    //   - the require() function for embedded resources must be removed to allow handle the `src` in `html-loader`
    method: 'html',
    queryParam: null,
    requireResource: (file) => `(${file})`,
    output: (funcBody, locals, esModule) => new Function('require', funcBody + ';return template;')(require)(locals),
  },
];

module.exports = loaderMethods;
