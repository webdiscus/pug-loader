const path = require('path');
const PugPlugin = require('pug-plugin');

module.exports = {
  mode: 'production',
  devtool: false,

  output: {
    path: path.join(__dirname, 'public/'),
    publicPath: '/',
    filename: 'assets/[name].[contenthash:4].js',
  },

  entry: {
    index: './src/index.pug',
  },

  plugins: [new PugPlugin()],

  module: {
    rules: [
      {
        test: /\.pug$/,
        use: [
          'html-loader',
          {
            loader: 'pug-loader',
            options: {
              method: 'html',
            },
          },
        ],
      },
    ],
  },
};