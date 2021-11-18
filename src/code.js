let cache = {},
  cacheIds = {},
  cacheId = 100;

/**
 * Load the file and return the reference string of cached source.
 *
 * @param {string} file The full filename to load source of this file.
 * @return {string}
 */
module.exports.require = (file) => {
  let id = cacheIds[file];
  if (!id) {
    id = cacheId++;
    cache[id] = require(file);
    cacheIds[file] = id;

    // Important: delete the file and self module from require.cache to allow reload cached files after changes.
    delete require.cache[file];
    delete require.cache[__filename];
  }

  return `__sources__[${id}]`;
};

/**
 * Get the source code of files cached by the require() function.
 *
 * @return {string}
 */
module.exports.getCode = () => (Object.keys(cache).length ? 'var __sources__ = ' + JSON.stringify(cache) + ';\n' : '');

/**
 * Get the list of the loaded files.
 *
 * @return {string[]}
 */
module.exports.getFiles = () => Object.keys(cacheIds);
