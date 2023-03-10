// Modules available in both pug-plugin and pug-loader.
// These modules store data for exchange between the plugin and the loader.

const pugLoaderPath = '@webdiscus/pug-loader';

// For local development of pug-plugin and pug-loader only.
// Update path in both pug-loader/src/Modules.js and pug-plugin/src/Modules.js files.
//const pugLoaderPath = '..';

module.exports = {
  plugin: require(pugLoaderPath + '/src/Plugin.js'),
  ScriptCollection: require(pugLoaderPath + '/src/ScriptCollection.js'),
};
