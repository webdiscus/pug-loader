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
    preferRelative: true,
    ...options,
    // restrict default extensions list '.js', '.json', '.wasm' for faster resolving
    extensions: options.extensions.length ? options.extensions : ['.js'],
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
  aliasFileRegexp: /^([~@])?(.*?)$/,
  hasAlias: false,
  hasPlugins: false,
  resolveFile: null,
  loader: null,
  dependency: null,

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
   * @param {Loader} object
   */
  setLoader(object) {
    this.loader = object;
  },

  /**
   * @param {LoaderDependency} object
   */
  setDependency(object) {
    this.dependency = object;
  },

  /**
   * @param {string} file
   * @return {boolean}
   */
  isScript(file) {
    return /\.js[a-z0-9]*$/i.test(file);
  },

  /**
   * Resolve filename.
   *
   * @param {string} file The file to resolve.
   * @param {string} templateFile The template file.
   * @param {boolean} [isScript=false] Whether the file is required in script tag.
   * @return {string}
   */
  resolve(file, templateFile, isScript = false) {
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
    if (!isScript) this.dependency.add(resolvedPath);

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
   * @param {boolean} isScript Whether the file is required in script tag.
   * @return {string}
   */
  interpolate(value, templateFile, isScript) {
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

    if (resolvedPath != null) {
      if (isWin) resolvedPath = pathToPosix(resolvedPath);

      if (!isScript) {
        // remove quotes: '/path/to/file.js' -> /path/to/file.js
        const watchFile = resolvedPath.slice(1, resolvedPath.length - 1);
        // add to watch only full resolved path, w/o interpolation like: '/path/to/' + file
        if (/["'`$]/g.test(watchFile) === false) {
          this.dependency.add(watchFile);
        }
      }
    }

    return resolvedPath || value;
  },

  /**
   * Resolve the paths of asset in require() used in a tag attribute.
   * For example, see test case `require-img-srcset`.
   *
   * @param {string} templateFile The filename of the template where resolves the resource.
   * @param {string} value The resource value or code included require().
   * @return {string}
   */
  resolveResource(templateFile, value) {
    const loader = this.loader;
    const openTag = 'require(';
    const openTagLen = openTag.length;
    let pos = value.indexOf(openTag);

    if (pos < 0) return value;

    let lastPos = 0;
    let result = '';
    let char;

    if (isWin) templateFile = pathToPosix(templateFile);

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
      const replacement = loader.require(file, templateFile);

      result += value.slice(lastPos, pos) + replacement;
      lastPos = endPos + 1;
      pos = value.indexOf(openTag, lastPos);
    }

    if (value.length - 1 > pos + openTagLen) {
      result += value.slice(lastPos);
    }

    return result;
  },

  resolveScript(templateFile, value) {
    const [, file] = /require\((.+?)(?=\))/.exec(value) || [];
    if (isWin) templateFile = pathToPosix(templateFile);

    return this.loader.requireScript(file, templateFile);
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

    // resolve alias to full filepath, e.g. `include AliasToFile`
    if (request.endsWith('.pug') && request.indexOf('/') < 0) {
      request = request.slice(0, -4);
      const [, prefix, aliasName] = this.aliasFileRegexp.exec(request) || [];
      let targetPath = this.aliases[aliasName];
      if (targetPath == null && prefix != null && aliasName != null) targetPath = this.aliases[aliasName.slice(1)];

      return targetPath;
    }

    // resolve alias as part of a request, e.g. `include Alias/path/to/file`
    let { ignorePrefix, aliasName, targetPath } = this.parseAliasInRequest(request);

    // try resolve alias w/o prefix
    if (ignorePrefix === true) targetPath = this.aliases[aliasName.slice(1)];

    return typeof targetPath === 'string' ? path.join(targetPath + request.slice(aliasName.length)) : targetPath;
  },

  /**
   * @param {string} request
   * @returns {{ignorePrefix: boolean, aliasName: string, targetPath: string || array || null}}
   * @private
   */
  parseAliasInRequest(request) {
    const [, prefix, alias] = this.aliasRegexp.exec(request) || [];
    let aliasName = (prefix || '') + (alias || '');
    let targetPath = this.aliases[aliasName];

    return {
      // whether a prefix should be ignored to try resolve alias w/o prefix
      ignorePrefix: targetPath == null && prefix != null && alias != null,
      aliasName,
      targetPath,
    };
  },
};

module.exports = resolver;
