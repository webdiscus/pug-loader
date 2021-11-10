const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const basePath = path.resolve(__dirname);
const webRootPath = path.join(__dirname, 'public/');
const publicPath = '/assets/';

module.exports = {
  stats: {
    children: true,
  },
  mode: 'production',
  entry: {},
  resolve: {
    alias: {
      Includes: path.join(basePath, 'src/includes/'),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: path.join(webRootPath, '/index.html'),
      template: './src/template/index.pug',
      inject: false,
    }),
  ],
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