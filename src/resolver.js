// the 'enhanced-resolve' package already used in webpack, don't need to define it in package.json
const ResolverFactory = require('enhanced-resolve');
const path = require('path');
const ansis = require('ansis');
const { loaderName, isWin, pathToPosix } = require('./utils');

/**
 * Create regexp to match alias.
 *
 * @param {string} match The matched alias.
 * @return {string} The regexp pattern with matched aliases.
 */
const aliasRegexp = (match) => `^[~@]?(${match})(?=\\/)`;

/**
 * Resolve an alias in the argument of require() function.
 *
 * @param {string} value The value of extends/include/require().
 * @param {{}} aliases The `resolve.alias` of webpack config.
 * @return {string | false} If found an alias return resolved normalized path otherwise return false.
 */
const resolveAlias = (value, aliases) => {
  if (!aliases) return false;

  const patternAliases = Object.keys(aliases).join('|');

  // webpack.alias is empty
  if (!patternAliases) return false;

  const [, alias] = new RegExp(aliasRegexp(patternAliases)).exec(value) || [];

  // path contains no alias
  if (!alias) return false;

  let resolvedFile = value.replace(new RegExp(aliasRegexp(alias)), aliases[alias]);

  return path.join(resolvedFile);
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

const resolveException = (file, templateFile, error) => {
  throw new Error(
    `\n${ansis.black.bgRedBright(`[${loaderName}]`)} the file ${ansis.yellow(
      file
    )} can't be resolved in the pug template:\n` +
      ansis.cyan(templateFile) +
      ``
  );
};

/**
 * @typedef {Object} LoaderResolver
 * @property {function(basedir:string, path:string, options:{})} init
 * @property {(function(context:string, file:string): string)} resolve
 * @property {function(templateFile:string, value:string, dependencies:string[]): string} resolveRequireCode
 * @property {function(templateFile:string, value:string, method:LoaderMethod): string} resolveRequireResource
 */

let pugLoaderBasedir = '/';
let aliases = null;
let resolveFile = null;

/**
 * @type LoaderResolver
 */
const resolver = {
  /**
   * @param {string} basedir The the root directory of all absolute inclusion.
   * @param {string} path The root context path.
   * @param {{}} options The webpack `resolve` configuration.
   */
  init: (basedir, path, options) => {
    pugLoaderBasedir = basedir;
    aliases = options.alias;
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
    let resolvedPath;

    // resolve an absolute path by prepending options.basedir
    if (file[0] === '/') {
      resolvedPath = path.join(pugLoaderBasedir, file);
    }

    // resolve a relative file
    if (!resolvedPath && file[0] === '.') {
      resolvedPath = path.join(context, file);
    }

    // resolve a file by webpack `resolve.alias`
    if (!resolvedPath) {
      resolvedPath = resolveAlias(file, aliases);
    }

    // fallback to enhanced resolver
    if (!resolvedPath) {
      try {
        resolvedPath = resolveFile(context, file);
      } catch (error) {
        resolveException(file, templateFile, error);
      }
    }

    if (isWin) resolvedPath = pathToPosix(resolvedPath);

    return resolvedPath;
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
