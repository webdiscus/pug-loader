const path = require('path');

module.exports = {
  output: {
    filename: '[name].js',
  },

  resolveLoader: {
    alias: {
      'pug-loader': path.join(__dirname, '../'),
    },
  },

  plugins: [],

  module: {
    rules: [],
  },

  optimization: {},
};