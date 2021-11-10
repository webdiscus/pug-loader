const path = require('path');
const basePath = path.resolve(__dirname);

module.exports = {
  mode: 'production',
  entry: {
    index: './src/index.js',
  },
  resolve: {
    alias: {
      Includes: path.join(basePath, 'src/includes/'),
      Images: path.join(basePath, 'src/images/'),
      Template: path.join(basePath, 'src/template/'),
    },
  },
  resolveLoader: {
    alias: {
      //'pug2-loader': '@webdiscus/pug-loader', // ok
      'pug2-loader': '../../../../', // ok
    },
  },
  plugins: [],
  module: {
    // disable a pug-loader in webpack config to use inline pug-loader in require query, e.g.:
    // require('@webdiscus/pug-loader!./template.pug')
    rules: [],
  },
};