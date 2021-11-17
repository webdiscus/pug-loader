/**
 * @typedef LoaderMethod
 * @property {string} method The compiler export method, defined in loader option.
 * @property {string} queryParam The same as `method`, but defined in resource query parameter.
 * @property {function(string)} require The inject require.
 * @property {function(string, {}, boolean)} output Generates a output content.
 */

const getExportCode = (esModule) => (esModule ? 'export default ' : 'module.exports=');
const requireAsset = (file) => `' + __asset_resource_require__('${file}') + '`;

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
    require: (file) => `require(${file})`,
    output: (funcBody, locals, esModule) => funcBody + ';' + getExportCode(esModule) + 'template;',
  },
  {
    // export rendered HTML string at compile time
    method: 'render',
    queryParam: 'pug-render',
    require: (file) => `requireAsset(${file})`,
    output: (funcBody, locals, esModule) =>
      getExportCode(esModule) +
      ("'" + new Function('requireAsset', funcBody + ';return template;')(requireAsset)(locals) + "';").replaceAll(
        '__asset_resource_require__',
        'require'
      ),
  },
  {
    // export the compiled template function, by require() it will be auto rendered into HTML string at runtime
    // @deprecated, it is reserved only as rescue fallback, after stable release of method `render` will be removed
    method: 'rtRender',
    queryParam: 'pug-rtrender',
    require: (file) => `require(${file})`,
    output: (funcBody, locals, esModule) => funcBody + ';' + getExportCode(esModule) + 'template();',
  },
  {
    // render to pure HTML string at compile time
    // note: this method should be used with additional loader to handle HTML
    method: 'html',
    queryParam: null,
    require: (file) => `(${file})`,
    output: (funcBody, locals, esModule) => new Function('', funcBody + ';return template;')()(locals),
  },
];

module.exports = loaderMethods;
