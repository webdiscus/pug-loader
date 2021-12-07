const path = require('path');
const PugPlugin = require('pug-plugin');
const basePath = path.resolve(__dirname);
const webRootPath = path.join(__dirname, 'public/');

module.exports = {
  mode: 'production',
  resolve: {
    alias: {
      Includes: path.join(basePath, 'src/includes/'),
      Template: path.join(basePath, 'src/template/'),
    },
  },

  output: {
    path: webRootPath,
    publicPath: '',
  },

  entry: {
    index: 'src/template/index.pug',
  },

  plugins: [new PugPlugin()],

  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: 'pug-loader',
        options: {
          method: 'compile',
        },
      },
    ],
  },
};