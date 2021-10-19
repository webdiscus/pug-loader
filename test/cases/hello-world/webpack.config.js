const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webRootPath = path.join(__dirname, 'public/');
const publicPath = '/assets/';

module.exports = {
  mode: 'production',
  entry: {},
  plugins: [
    new HtmlWebpackPlugin({
      filename: path.join(webRootPath, '/index.html'),
      template: './src/index.pug',
      inject: false,
    }),
  ],
};