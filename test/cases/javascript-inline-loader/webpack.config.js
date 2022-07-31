const path = require('path');

module.exports = {
  mode: 'production',

  output: {
    path: path.join(__dirname, 'public/'),
    publicPath: '',
  },

  entry: {
    index: './src/index.js',
  },

  resolve: {
    alias: {
      Includes: path.join(__dirname, 'src/includes/'),
      Images: path.join(__dirname, 'src/images/'),
      Views: path.join(__dirname, 'src/views/'),
    },
  },

  plugins: [],

  module: {
    // Note: the loader name is defined at `resolveLoader.alias` as 'pug-loader': '@webdiscus/pug-loader'
    // disable a pug-loader in webpack config to use inline pug-loader in require query, e.g.:
    // require('pug-loader!./index.pug')
    rules: [],
  },
};