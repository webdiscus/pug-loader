const path = require('path');
const PugPlugin = require('../../pug-plugin');

module.exports = {
  mode: 'production',

  resolve: {
    alias: {
      Includes: path.join(__dirname, 'src/includes/'),
    },
  },

  output: {
    path: path.join(__dirname, 'public/'),
    publicPath: '',
  },

  entry: {
    index: 'src/views/index.pug',
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