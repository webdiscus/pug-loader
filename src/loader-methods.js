// add polyfill for node.js >= 12.0.0 && < 15.0.0
require('./polyfills/string.replaceAll');

/**
 * @typedef LoaderMethod
 * @property {string} method The compiler export method, defined in loader option.
 * @property {string} queryParam The same as `method`, but defined in resource query parameter.
 * @property {function(string)} requireResource The inject require of resource.
 * @property {function(string, {}, boolean)} output Generates a output content.
 */

const getExportCode = (esModule) => (esModule ? 'export default ' : 'module.exports=');
const requireResource = (file) => `' + __asset_resource_require__('${file}') + '`;

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
    requireResource: (file) => `requireResource(${file})`,
    output: (funcBody, locals, esModule) =>
      getExportCode(esModule) +
      (
        "'" +
        new Function('requireResource', funcBody + ';return template;')(requireResource)(locals) +
        "';"
      ).replaceAll('__asset_resource_require__', 'require'),
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
    // note: this method should be used with additional loader to handle HTML
    method: 'html',
    queryParam: null,
    requireResource: (file) => `(${file})`,
    output: (funcBody, locals, esModule) => new Function('', funcBody + ';return template;')()(locals),
  },
];

module.exports = loaderMethods;
