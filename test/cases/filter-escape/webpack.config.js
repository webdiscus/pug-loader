const path = require('path');
const PugPlugin = require('../../pug-plugin');

const webRootPath = path.join(__dirname, 'public/');

module.exports = {
  mode: 'production',

  output: {
    path: webRootPath,
    publicPath: '/',
  },

  entry: {
    index: 'src/index.pug',
  },

  plugins: [new PugPlugin()],

  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: 'pug-loader',
        options: {
          method: 'render',
          // test embedded filter `:escape`
          embedFilters: {
            escape: true,
          },
        },
      },
    ],
  },
};