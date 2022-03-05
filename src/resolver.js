// the 'enhanced-resolve' package already used in webpack, don't need to define it in package.json
const ResolverFactory = require('enhanced-resolve');
const path = require('path');
const { isWin, pathToPosix } = require('./utils');
const { resolveException, unsupportedInterpolationException } = require('./exeptions');

/**
 * @param {string} path The start path to resolve.
 * @param {{}} options The enhanced-resolve options.
 * @returns {function(context:string, request:string): string | false}
 */
const fileResolverSyncFactory = (path, options) => {
  const resolve = ResolverFactory.create.sync({
    ...options,
    aliasFields: [],
    conditionNames: [],
    descriptionFiles: [],
    exportsFields: [],
    mainFields: [],
    modules: [],
    mainFiles: [],
    extensions: ['.js'],
    preferRelative: true,
  });

  return (context, request) => {
    if (!request) request = context;
    else path = context;
    return resolve(path, request);
  };
};

/**
 * @typedef {Object} LoaderResolver
 * @property {string} [basedir = '/']
 * @property {Object} [aliases = {}]
 * @property {boolean} hasAlias
 * @property {boolean} hasPlugins
 * @property {function(basedir:string, path:string, options:{})} init
 * @property {(function(file:string, context:string): string)} resolve
 * @property {(function(file:string, context:string): string)} interpolate
 * @property {(function(value:string): string)} resolveAlias
 * @property {function(context:string, request:string): string|null} resolveFile
 * @property {function(templateFile:string, value:string): string} resolveCodeFile
 * @property {function(templateFile:string, value:string): string} resolveResource
 */

/**
 * @type LoaderResolver
 */
const resolver = {
  basedir: '/',
  aliasRegexp: /^([~@])?(.*?)(?=\/)/,
  hasAlias: false,
  hasPlugins: false,
  resolveFile: null,
  loader: null,
  dependencies: [],

  /**
   * @param {string} context The root context path.
   * @param {string} basedir The the root directory of all absolute inclusion.
   * @param {{}} options The webpack `resolve` options.
   */
  init({ context, basedir, options }) {
    this.basedir = basedir;
    this.aliases = options.alias || {};
    this.hasAlias = Object.keys(this.aliases).length > 0;
    this.hasPlugins = options.plugins && Object.keys(options.plugins).length > 0;
    this.resolveFile = fileResolverSyncFactory(context, options);
    this.dependencies = [];
  },

  /**
   * @param {Loader} loader
   */
  setLoader(loader) {
    this.loader = loader;
  },

  /**
   * @return {Array<string>}
   */
  getDependencies() {
    return this.dependencies;
  },

  /**
   * @param {string} file
   * @return {boolean}
   */
  isScript(file) {
    return /\.js[a-z0-9]*$/i.test(file);
  },

  /**
   * Add required file for watching.
   *
   * @param {string} file
   */
  addDependency(file) {
    if (!/.(js|json)$/i.test(file)) return;

    const dependency = isWin ? path.normalize(file) : file;

    // delete the file from require.cache to allow reloading cached files after changes by watch
    delete require.cache[dependency];
    this.dependencies.push(dependency);
  },

  /**
   * Resolve filename.
   *
   * @param {string} file The file to resolve.
   * @param {string} templateFile The template file.
   * @return {string}
   */
  resolve(file, templateFile) {
    const context = path.dirname(templateFile);
    let resolvedPath = null;

    // resolve an absolute path by prepending options.basedir
    if (file[0] === '/') {
      resolvedPath = path.join(this.basedir, file);
    }

    // resolve a relative file
    if (resolvedPath == null && file[0] === '.') {
      resolvedPath = path.join(context, file);
    }

    // resolve a file by webpack `resolve.alias`
    if (resolvedPath == null) {
      resolvedPath = this.resolveAlias(file);
    }

    // fallback to enhanced resolver
    if (resolvedPath == null || Array.isArray(resolvedPath)) {
      try {
        let request = file;
        if (Array.isArray(resolvedPath)) {
          // remove optional prefix in request for enhanced resolver
          const { ignorePrefix } = this.parseAliasInRequest(request);
          if (ignorePrefix) request = request.substring(1);
        }
        resolvedPath = this.resolveFile(context, request);
      } catch (error) {
        resolveException(error, file, templateFile);
      }
    }

    if (isWin) resolvedPath = pathToPosix(resolvedPath);

    return resolvedPath;
  },

  /**
   * Interpolate filename for `compile` method.
   *
   * @note: the file is the argument of require() and can be any expression, like require('./' + file + '.jpg').
   * See https://webpack.js.org/guides/dependency-management/#require-with-expression.
   *
   * @param {string} value The expression to resolve.
   * @param {string} templateFile The template file.
   * @return {string}
   */
  interpolate(value, templateFile) {
    value = value.trim();

    const [, quote, file] = /(^"|'|`)(.+?)(?=`|'|")/.exec(value) || [];
    let resolvedPath = null;
    let tryToResolveFile = file;

    // the argument begin with a string quote
    const context = path.dirname(templateFile) + '/';

    if (!file) {
      // fix webpack require issue `Cannot find module` for the case:
      // - var file = './image.jpeg';
      // require(file) <- error
      // require(file + '') <- solution
      return value + ` + ''`;
    }

    // resolve an absolute path by prepending options.basedir
    if (file[0] === '/') {
      resolvedPath = quote + this.basedir + value.substring(2);
    }

    // resolve a file in current directory
    if (resolvedPath == null && file.substring(0, 2) === './') {
      resolvedPath = quote + context + value.substring(3);
    }

    // resolve a file in parent directory
    if (resolvedPath == null && file.substring(0, 3) === '../') {
      resolvedPath = quote + context + value.substring(1);
    }

    // resolve a webpack `resolve.alias`
    if (resolvedPath == null) {
      resolvedPath = this.resolveAlias(value.substring(1));

      if (typeof resolvedPath === 'string') {
        resolvedPath = quote + resolvedPath;
      } else if (Array.isArray(resolvedPath)) {
        resolvedPath = null;
        const { ignorePrefix } = this.parseAliasInRequest(file);
        if (ignorePrefix) tryToResolveFile = file.substring(1);
      }
    }

    // try the enhanced resolver for alias from tsconfig or for alias as array of paths
    // the following examples work:
    // '@data/path/script'
    // '@data/path/script.js'
    // '@images/logo.jpg'
    // `${file}`
    if (resolvedPath == null) {
      if (file.indexOf('{') < 0 && !file.endsWith('/')) {
        try {
          const resolvedFile = this.resolveFile(context, tryToResolveFile);
          resolvedPath = value.replace(file, resolvedFile);
        } catch (error) {
          resolveException(error, value, templateFile);
        }
      } else if (~file.indexOf('/')) {
        // @note: resolve of alias from tsconfig in interpolating string is not supported for `compile` method,
        // the following examples not work:
        // `@data/${pathname}/script`
        // `@data/${pathname}/script.js`
        // `@data/path/${filename}`
        // '@data/path/' + filename
        unsupportedInterpolationException(value, templateFile);
      }
    }

    if (isWin && resolvedPath != null) resolvedPath = pathToPosix(resolvedPath);
    if (!resolvedPath) resolvedPath = value;

    return resolvedPath;
  },

  /**
   * Resolve the paths of asset in require() used in a tag attribute.
   * For example, see test case `require-img-srcset`.
   *
   * @param {string} templateFile The filename of the template where resolves the resource.
   * @param {string} value The resource value include require().
   * @return {string}
   */
  resolveResource(templateFile, value) {
    const self = this;
    if (isWin) templateFile = pathToPosix(templateFile);

    return value.replaceAll(/require\(.+?\)/g, (value) => {
      const [, file] = /require\((.+?)(?=\))/.exec(value) || [];
      return self.loader.require(file, templateFile);
    });
  },

  /**
   * Resolve an alias in the argument of require() function.
   *
   * @param {string} request The value of extends/include/require().
   * @return {string | [] | null} If found an alias return resolved normalized path otherwise return false.
   * @private
   */
  resolveAlias(request) {
    if (this.hasAlias === false) return null;

    let { ignorePrefix, aliasName, targetPath } = this.parseAliasInRequest(request);

    // try resolve alias w/o prefix
    if (ignorePrefix === true) targetPath = this.aliases[aliasName.substring(1)];

    return typeof targetPath === 'string' ? path.join(targetPath + request.substring(aliasName.length)) : targetPath;
  },

  /**
   * @param {string} request
   * @returns {{aliasName: string, ignorePrefix: boolean, targetPath: string || array || null}}
   * @private
   */
  parseAliasInRequest(request) {
    const [, prefix, alias] = this.aliasRegexp.exec(request) || [];
    const aliasName = (prefix || '') + (alias || '');
    const targetPath = this.aliases[aliasName];
    const ignorePrefix = prefix != null && alias != null && targetPath == null;

    return {
      // whether a prefix should be ignored to try resolve alias w/o prefix
      ignorePrefix,
      aliasName,
      targetPath,
    };
  },
};

module.exports = resolver;
