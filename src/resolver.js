// the 'enhanced-resolve' package already used in webpack, don't need to define it in package.json
const ResolverFactory = require('enhanced-resolve');
const path = require('path');
const { isWin, pathToPosix } = require('./utils');
const { resolveException } = require('./exeptions');

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
    extensions: [],
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
  // the resolved files
  resolvedFiles: [],

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
  getResolvedFiles() {
    return this.resolvedFiles;
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
   * @param {string} file The file to resolve.
   * @param {string} templateFile The template file.
   * @return {string}
   */
  interpolate(file, templateFile) {
    file = file.trim();
    const quote = file[0];
    let resolvedPath = null;

    // the argument begin with a string quote
    if ('\'"`'.indexOf(quote) >= 0) {
      const context = path.dirname(templateFile) + '/';

      // resolve an absolute path by prepending options.basedir
      if (file[1] === '/') {
        resolvedPath = file[0] + this.basedir + file.substring(2);
      }

      // resolve a relative file
      // fix the issue when the required file has a relative path (`./` or `../`) and is in an included file
      if (resolvedPath == null && file.substring(1, 4) === '../') {
        resolvedPath = file[0] + context + file.substring(1);
      }

      // resolve a relative file
      if (resolvedPath == null && file.substring(1, 3) === './') {
        resolvedPath = file[0] + context + file.substring(3);
      }

      // resolve a webpack `resolve.alias`
      if (resolvedPath == null) {
        resolvedPath = this.resolveAlias(file.substring(1));

        if (typeof resolvedPath === 'string') {
          resolvedPath = file[0] + resolvedPath;
        } else if (Array.isArray(resolvedPath)) {
          // try to resolve via enhanced resolver by webpack self at compilation time
          resolvedPath = file;
          // remove optional prefix in request for enhanced resolver
          const { ignorePrefix } = this.parseAliasInRequest(file.substring(1));
          if (ignorePrefix) resolvedPath = file[0] + file.substring(2);
        }
      }

      if (isWin && resolvedPath != null) resolvedPath = pathToPosix(resolvedPath);
    } else {
      // fix webpack require issue `Cannot find module` for the case:
      // - var file = './image.jpeg';
      // require(file) <- error
      // require(file + '') <- solution
      file += " + ''";
    }

    return resolvedPath || file;
  },

  /**
   * Resolve the path of source file in require().
   *
   * @param {string} templateFile The filename of the template where resolves the resource.
   * @param {string} value The resource value include require().
   * @return {string}
   */
  resolveSource(templateFile, value) {
    const self = this;
    return value.replaceAll(/(require\(.+?\))/g, (value) => {
      const [, file] = /(?<=require\("|'|`)(.+)(?=`|'|"\))/.exec(value) || [];
      let resolvedFile = self.resolve(file, templateFile);
      const dependencyFile = isWin ? path.normalize(resolvedFile) : resolvedFile;

      // Important: delete the file from require.cache to allow reloading cached files after changes by watch.
      delete require.cache[dependencyFile];
      self.resolvedFiles.push(dependencyFile);

      return `require('${resolvedFile}')`;
    });
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
   * @return {string | null} If found an alias return resolved normalized path otherwise return false.
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
