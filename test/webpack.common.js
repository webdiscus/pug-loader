const path = require('path');
const basePath = path.resolve(__dirname);

module.exports = {
  output: {
    publicPath: '',
    filename: '[name].js',
    assetModuleFilename: 'assets/images/[hash][ext][query]',
  },

  resolveLoader: {
    alias: {
      //'pug-loader': '@webdiscus/pug-loader', // test it only after deploy to npm repository
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