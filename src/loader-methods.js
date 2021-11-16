/**
 * @typedef LoaderMethod
 * @property {string} method The compiler export method, defined in loader option.
 * @property {string} queryParam The same as `method`, but defined in resource query parameter.
 * @property {function(string)} getLocals Get template variables. Here can be merged additional custom properties.
 * @property {function(string)} require The inject require.
 * @property {function(string, string, {}, boolean)} output Generates a output content.
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
    getLocals: (locals) => locals,
    require: (file) => `require(${file})`,
    output: (funcBody, name, locals, esModule) => funcBody + ';' + getExportCode(esModule) + name + ';',
  },
  {
    // export rendered HTML string at compile time
    method: 'render',
    queryParam: 'pug-render',
    getLocals: (locals) => ({
      ...locals,
      ...{ __asset_resource_require__: (file) => `' + __asset_resource_require__(\`${file}\`) + '` },
    }),
    require: (file) => `locals.__asset_resource_require__(${file})`,
    output: (funcBody, name, locals, esModule) =>
      (getExportCode(esModule) + "'" + new Function('', funcBody + ';return ' + name + '')()(locals) + "';").replaceAll(
        '__asset_resource_require__',
        'require'
      ),
  },
  {
    // export the compiled template function, by require() it will be auto rendered into HTML string at runtime
    // @deprecated, it is reserved only as rescue fallback, after stable release of method `render` will be removed
    method: 'rtRender',
    queryParam: 'pug-rtrender',
    getLocals: (locals) => locals,
    require: (file) => `require(${file})`,
    output: (funcBody, name, locals, esModule) => funcBody + ';' + getExportCode(esModule) + name + '();',
  },
  {
    // render to pure HTML string at compile time
    // note: this method should be used with additional loader to handle HTML
    method: 'html',
    queryParam: null,
    getLocals: (locals) => locals,
    require: (file) => `(${file})`,
    output: (funcBody, name, locals, esModule) => new Function('', funcBody + ';return ' + name + ';')()(locals),
  },
];

module.exports = loaderMethods;
