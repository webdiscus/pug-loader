const path = require('path');
const basePath = path.resolve(__dirname);

module.exports = {
  output: {
    filename: '[name].js',
  },

  resolveLoader: {
    alias: {
      'pug-loader': path.join(basePath, '../'),
      'asset-loader': path.join(basePath, '../src/asset-loader.js'),
    },
  },

  plugins: [],

  module: {
    rules: [],
  },

  optimization: {
    removeEmptyChunks: true,
    mergeDuplicateChunks: true,
    usedExports: true,
    concatenateModules: true,
  },
};