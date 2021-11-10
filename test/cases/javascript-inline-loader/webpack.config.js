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
  plugins: [],
  module: {
    // Note: the loader name is defined at `resolveLoader.alias` as 'pug-loader': '@webdiscus/pug-loader'
    // disable a pug-loader in webpack config to use inline pug-loader in require query, e.g.:
    // require('pug-loader!./template.pug')
    rules: [],
  },
};