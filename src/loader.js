/**
 * @typedef LoaderMethod
 * @property {string} method The compiler export method, defined in loader option.
 * @property {string} queryParam The same as `method`, but defined in resource query parameter.
 * @property {function(file:string, context:string)} requireResource The inject require of resource.
 * @property {function(templateFile:string, funcBody:string, locals:{}, esModule:boolean?)} run Generates a result of loader method.
 */

const { executeTemplateFunctionException } = require('./exeptions');

/**
 * @type {LoaderResolver}
 */
let loaderResolver;

/**
 * Array of required files with method compile.
 * @type {string[]}
 */
let assetFiles = [];

/**
 * Normalize filename in require() function for method `compile`.
 *
 * @param {string} file The resource file.
 * @param {string} templateFile The template file.
 * @returns {string}
 */
const compileRequire = (file, templateFile) => {
  const resolvedFile = loaderResolver.resolve(file, templateFile);
  assetFiles.push(resolvedFile);

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
 * @param {boolean} esModule
 * @returns {string}
 */
const getExportCode = (esModule) => (esModule ? 'export default ' : 'module.exports=');

/**
 * @param {string} funcBody The function body.
 * @param {Object} locals The local template variables.
 * @param {Function} methodRequire The require function for the method.
 * @param {string} templateFile The path of template file.
 * @returns {string}
 */
const runTemplateFunction = (funcBody, locals, methodRequire, templateFile) => {
  let result;

  try {
    result = new Function('require', '__PUG_LOADER_REQUIRE__', funcBody + ';return template;')(
      require,
      methodRequire
    )(locals);
  } catch (error) {
    executeTemplateFunctionException(error, templateFile);
  }

  return result;
};

const loader = {
  /**
   * @param {LoaderResolver} resolver
   */
  setResolver: (resolver) => {
    loaderResolver = resolver;
  },

  /**
   * Loader methods for returning a result.
   * @type {LoaderMethod[]}
   */
  methods: [
    {
      // compile into template function and export a JS module
      method: 'compile',
      queryParam: 'pug-compile',
      requireResource: (file, templateFile) => `__PUG_LOADER_REQUIRE__(${file}, '${templateFile}')`,
      run: (templateFile, funcBody, locals, esModule) => {
        if (~funcBody.indexOf('__PUG_LOADER_REQUIRE__(')) {
          let index = 0;
          assetFiles = [];

          // execute the code to evaluate required path with variables
          // and save resolved filenames in the cache for replacing in the template function
          runTemplateFunction(funcBody, locals, compileRequire, templateFile);

          // replace the required variable filename with resolved file
          funcBody = funcBody.replaceAll(/__PUG_LOADER_REQUIRE__\(.+?\)/g, () => `require('${assetFiles[index++]}')`);
        }

        return funcBody + ';' + getExportCode(esModule) + 'template;';
      },
    },

    {
      // render into HTML and export a JS module
      method: 'render',
      queryParam: 'pug-render',
      requireResource: (file, templateFile) => `__PUG_LOADER_REQUIRE__(${file}, '${templateFile}')`,
      run: (templateFile, funcBody, locals, esModule) => {
        let result = runTemplateFunction(funcBody, locals, renderRequire, templateFile)
          .replace(/\n/g, '\\n')
          .replace(/'/g, "\\'")
          .replace(/\\u0027/g, "'");

        return getExportCode(esModule) + "'" + result + "';";
      },
    },

    {
      // render into HTML and return the pure string
      // notes:
      //   - this method require an additional loader, like `html-loader`, to handle HTML string
      //   - the require() function for embedded resources must be removed to allow handle the `src` in `html-loader`
      method: 'html',
      queryParam: null,
      requireResource: (file, templateFile) => `__PUG_LOADER_REQUIRE__(${file}, '${templateFile}')`,
      run: (templateFile, funcBody, locals) => runTemplateFunction(funcBody, locals, htmlRequire, templateFile),
    },
  ],
};

module.exports = loader;
