/**
 * @typedef LoaderMethod
 * @property {string} method The compiler export method, defined in loader option.
 * @property {string} queryParam The same as `method`, but defined in resource query parameter.
 * @property {function(file:string, context:string)} requireResource The inject require of resource.
 * @property {function(string, {}, boolean)} output Generates a output content.
 */

const getExportCode = (esModule) => (esModule ? 'export default ' : 'module.exports=');

/**
 * Normalize filename in require() function for method `compile`.
 *
 * @param {string} file The resource file.
 * @param {string} templateFile The template file.
 * @returns {string}
 */
const compileRequire = (file, templateFile) => {
  const resolvedFile = loaderResolver.resolve(file, templateFile);
  requiredFiles.push(resolvedFile);

  return `require('${resolvedFile}')`;
};

/**
 * Inject in HTML string the require() function for method `render`.
 * Note: the file will be normalized via `path.join()`.
 *
 * @param {string} file The resource file.
 * @param {string} templateFile The template file.
 * @returns {string}
 */
const renderRequire = (file, templateFile) => {
  let resolvedFile = loaderResolver.resolve(file, templateFile);

  return `\\u0027 + require(\\u0027${resolvedFile}\\u0027) + \\u0027`;
};

/**
 * Normalize filename in require() function for method `html`.
 *
 * @param {string} file The resource file.
 * @param {string} templateFile The template file.
 * @returns {string}
 */
const htmlRequire = (file, templateFile) => loaderResolver.resolve(file, templateFile);

/**
 * Array of required files with method compile.
 * @type {string[]}
 */
let requiredFiles = [];

/**
 * @type {LoaderResolver}
 */
let loaderResolver;

const loader = {
  /**
   * @param {LoaderResolver} resolver
   */
  setResolver: (resolver) => {
    loaderResolver = resolver;
  },

  /**
   * Loader methods to export template function.
   * @type {LoaderMethod[]}
   */
  methods: [
    {
      // export the compiled template function
      method: 'compile',
      queryParam: 'pug-compile',
      requireResource: (file, templateFile) => `__PUG_LOADER_REQUIRE__(${file}, '${templateFile}')`,
      output: (funcBody, locals, esModule) => {
        if (~funcBody.indexOf('__PUG_LOADER_REQUIRE__(')) {
          let index = 0;
          requiredFiles = [];

          // execute the code to evaluate required path with variables
          // and save resolved filenames in the cache for replacing in the template function
          new Function('require', '__PUG_LOADER_REQUIRE__', funcBody + ';return template;')(
            require,
            compileRequire
          )(locals);

          // replace the required variable filename with resolved file
          funcBody = funcBody.replaceAll(
            /(?:__PUG_LOADER_REQUIRE__\(.+?\))/g,
            () => `require('${requiredFiles[index++]}')`
          );
        }

        return funcBody + ';' + getExportCode(esModule) + 'template;';
      },
    },

    {
      // export rendered HTML string at compile time
      method: 'render',
      queryParam: 'pug-render',
      requireResource: (file, templateFile) => `__PUG_LOADER_REQUIRE__(${file}, '${templateFile}')`,
      output: (funcBody, locals, esModule) => {
        let result = new Function('require', '__PUG_LOADER_REQUIRE__', funcBody + ';return template;')(
          require,
          renderRequire
        )(locals);

        result = result
          .replace(/\n/g, '\\n')
          .replace(/'/g, "\\'")
          .replace(/\\u0027/g, "'");

        return getExportCode(esModule) + "'" + result + "';";
      },
    },

    {
      // render to pure HTML string at compile time
      // notes:
      //   - this method has not a query parameter for method
      //   - this method should be used with additional loader to handle HTML
      //   - the require() function for embedded resources must be removed to allow handle the `src` in `html-loader`
      method: 'html',
      queryParam: null,
      requireResource: (file, templateFile) => `__PUG_LOADER_REQUIRE__(${file}, '${templateFile}')`,
      output: (funcBody, locals, esModule) =>
        new Function('require', '__PUG_LOADER_REQUIRE__', funcBody + ';return template;')(require, htmlRequire)(locals),
    },
  ],
};

module.exports = loader;
