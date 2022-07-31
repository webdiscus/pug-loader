const path = require('path');
const PugPlugin = require('../../pug-plugin');

module.exports = {
  mode: 'production',
  devtool: false,

  output: {
    path: path.join(__dirname, 'public/'),
    publicPath: '/',
    filename: 'assets/[name].[contenthash:8].js',
  },

  resolve: {
    alias: {
      Scripts: path.join(__dirname, 'src/assets/scripts/'),
      ScriptsContext: '/src/assets/scripts/',
    },
  },

  entry: {
    index: './src/views/index.pug',
  },

  plugins: [new PugPlugin()],

  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: 'pug-loader',
        options: {
          method: 'render',
        },
      },
    ],
  },
};