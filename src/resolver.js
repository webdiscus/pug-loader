// the 'enhanced-resolve' package already used in webpack, don't need to define it in package.json
const ResolverFactory = require('enhanced-resolve');

// reserved for next release
const DirectoryResolvePlugin = require('./directory-resolve-plugin');

/**
 * @param {string} path The start path to resolve.
 * @param {{}} options The enhanced-resolve options.
 * @returns {function(context:string, request:string): string | false}
 */
const getPugResolverSync = (path, options) => {
  const resolve = ResolverFactory.create.sync({
    ...options,
    aliasFields: [],
    conditionNames: [],
    descriptionFiles: [],
    exportsFields: [],
    mainFields: [],
    modules: [],
    mainFiles: [],
    extensions: ['.pug'],
    restrictions: [/\.(pug)$/i],
    preferRelative: true,
  });

  return (context, request) => {
    if (!request) request = context;
    else path = context;
    return resolve(path, request);
  };
};

/**
 * TODO resolve only directory, without file
 *
 * @param {string} path The start path to resolve.
 * @param {{}} options The enhanced-resolve options.
 * @returns {function(context:string, request:string): string | false}
 */
const getDirResolverSync = (path, options) => {
  const resolve = ResolverFactory.create.sync({
    ...options,
    aliasFields: [],
    conditionNames: [],
    descriptionFiles: [],

    mainFields: [],
    mainFiles: [],
    extensions: [],
    exportsFields: [],
    modules: [],

    plugins: [
      '...',
      //new DirectoryResolvePlugin('undescribed-existing-directory', 'resolved'), // ok for resolve.alias
      //new DirectoryResolvePlugin('relative', 'resolved'), // ok for resolve.alias, but not for resolve.plugins
      //new DirectoryResolvePlugin('resolved', 'file'), // max
      new DirectoryResolvePlugin('directory', 'relative'), //
    ],

    preferRelative: true,
  });

  return (request) => resolve(path, request);
};

module.exports = {
  getPugResolverSync,
  getDirResolverSync,
};
