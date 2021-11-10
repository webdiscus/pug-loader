const path = require('path');
const basePath = path.resolve(__dirname);

module.exports = {
  output: {
    filename: '[name].js',
    publicPath: '',
    assetModuleFilename: 'assets/images/[hash][ext][query]',
  },

  resolveLoader: {
    alias: {
      //'pug-loader': '@webdiscus/pug-loader', // test it only after deploy to npm repository
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