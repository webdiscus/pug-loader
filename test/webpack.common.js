const path = require('path');

module.exports = {
  devtool: false,
  // avoid double error output in console
  stats: 'errors-warnings',

  output: {
    // clean the output directory before emitting
    clean: true,
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

  experiments: {
    //futureDefaults: true,
    // set behavior as in Webpack <= v5.82 to avoid/decries randomizing of hashing names
    topLevelAwait: false,
  },

  optimization: {},
};