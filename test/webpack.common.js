const path = require('path');
const basePath = path.resolve(__dirname);

module.exports = {
  output: {
    filename: '[name].js',
  },

  resolveLoader: {
    alias: {
      'pug-loader': path.join(basePath, '../'),
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