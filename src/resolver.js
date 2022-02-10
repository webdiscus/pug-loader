// the 'enhanced-resolve' package already used in webpack, don't need to define it in package.json
const ResolverFactory = require('enhanced-resolve');
const path = require('path');
const { isWin, pathToPosix } = require('./utils');
const { resolveException } = require('./exeptions');

const aliasRegexp = /^([~@])?(.*?)(?=\/)/;

/**
 * @param {string} request
 * @returns {{aliasName: string, ignorePrefix: boolean, targetPath: string || array || null}}
 */
const parseAliasInRequest = (request) => {
  const [, prefix, alias] = aliasRegexp.exec(request) || [];
  const aliasName = (prefix || '') + (alias || '');
  const targetPath = resolver.aliases[aliasName];
  const ignorePrefix = prefix != null && alias != null && targetPath == null;

  return {
    // whether a prefix should be ignored to try resolve alias w/o prefix
    ignorePrefix,
    aliasName,
    targetPath,
  };
};

/**
 * @param {string} path The start path to resolve.
 * @param {{}} options The enhanced-resolve options.
 * @returns {function(context:string, request:string): string | false}
 */
const getFileResolverSync = (path, options) => {
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
 * @property {function(templateFile:string, value:string, dependencies:string[]): string} resolveRequireCode
 * @property {function(templateFile:string, value:string, method:LoaderMethod): string} resolveRequireResource
 */

let resolveFile = null;

/**
 * @type LoaderResolver
 */
const resolver = {
  basedir: '/',
  hasAlias: false,
  hasPlugins: false,

  /**
   * @param {string} basedir The the root directory of all absolute inclusion.
   * @param {string} path The root context path.
   * @param {{}} options The webpack `resolve` configuration.
   */
  init: (basedir, path, options) => {
    resolver.basedir = basedir;
    resolver.aliases = options.alias || {};
    resolver.hasAlias = Object.keys(resolver.aliases).length > 0;
    resolver.hasPlugins = options.plugins && Object.keys(options.plugins).length > 0;

    resolveFile = getFileResolverSync(path, options);
  },

  /**
   * Resolve filename.
   *
   * @param {string} file The file to resolve.
   * @param {string} templateFile The template file.
   * @return {string}
   */
  resolve: (file, templateFile) => {
    const context = path.dirname(templateFile);
    let resolvedPath = null;

    // resolve an absolute path by prepending options.basedir
    if (file[0] === '/') {
      resolvedPath = path.join(resolver.basedir, file);
    }

    // resolve a relative file
    if (resolvedPath == null && file[0] === '.') {
      resolvedPath = path.join(context, file);
    }

    // resolve a file by webpack `resolve.alias`
    if (resolvedPath == null) {
      resolvedPath = resolver.resolveAlias(file);
    }

    // fallback to enhanced resolver
    if (resolvedPath == null || Array.isArray(resolvedPath)) {
      try {
        let request = file;
        if (Array.isArray(resolvedPath)) {
          // remove optional prefix in request for enhanced resolver
          const { ignorePrefix } = parseAliasInRequest(request);
          if (ignorePrefix) request = request.substring(1);
        }
        resolvedPath = resolveFile(context, request);
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
  interpolate: (file, templateFile) => {
    file = file.trim();
    const quote = file[0];
    let resolvedPath = null;

    // the argument begin with a string quote
    if ('\'"`'.indexOf(quote) >= 0) {
      const context = path.dirname(templateFile) + '/';

      // resolve an absolute path by prepending options.basedir
      if (file[1] === '/') {
        resolvedPath = file[0] + resolver.basedir + file.substring(2);
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
        resolvedPath = resolver.resolveAlias(file.substring(1));

        if (typeof resolvedPath === 'string') {
          resolvedPath = file[0] + resolvedPath;
        } else if (Array.isArray(resolvedPath)) {
          // try to resolve via enhanced resolver by webpack self at compilation time
          resolvedPath = file;
          // remove optional prefix in request for enhanced resolver
          const { ignorePrefix } = parseAliasInRequest(file.substring(1));
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
   * Resolve an alias in the argument of require() function.
   *
   * @param {string} request The value of extends/include/require().
   * @return {string | null} If found an alias return resolved normalized path otherwise return false.
   */
  resolveAlias: (request) => {
    if (resolver.hasAlias === false) return null;

    let { ignorePrefix, aliasName, targetPath } = parseAliasInRequest(request);
    // try resolve alias w/o prefix
    if (ignorePrefix === true) targetPath = resolver.aliases[aliasName.substring(1)];

    return typeof targetPath === 'string' ? path.join(targetPath + request.substring(aliasName.length)) : targetPath;
    //return typeof targetPath === 'string' ? targetPath + request.substring(aliasName.length) : null;
  },

  /**
   * Resolve the source path in require().
   *
   * @param {string} templateFile The filename of the template where resolves the resource.
   * @param {string} value The resource value include require().
   * @param {string[]} dependencies The list of dependencies for watching.
   * @return {string}
   */
  resolveRequireCode: (templateFile, value, dependencies) =>
    value.replaceAll(/(require\(.+?\))/g, (value) => {
      const [, file] = /(?<=require\("|'|`)(.+)(?=`|'|"\))/.exec(value) || [];
      const resolvedPath = resolver.resolve(file, templateFile);
      const dependencyFile = isWin ? path.normalize(resolvedPath) : resolvedPath;

      // Important: delete the file from require.cache to allow reloading cached files after changes by watch.
      delete require.cache[dependencyFile];
      dependencies.push(dependencyFile);

      return `require('${resolvedPath}')`;
    }),

  /**
   * Resolve the required source paths in the tag attribute.
   * For example, see test case `require-img-srcset`.
   *
   * @param {string} templateFile The filename of the template where resolves the resource.
   * @param {string} value The resource value include require().
   * @param {LoaderMethod} method The object of the current method.
   * @return {string}
   */
  resolveRequireResource: (templateFile, value, method) => {
    if (isWin) templateFile = pathToPosix(templateFile);

    return value.replaceAll(/require\(.+?\)/g, (value) => {
      const [, file] = /require\((.+?)(?=\))/.exec(value) || [];
      return method.requireResource(file, templateFile);
    });
  },
};

module.exports = resolver;
