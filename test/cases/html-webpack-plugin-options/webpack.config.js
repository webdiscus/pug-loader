const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'production',

  output: {
    path: path.join(__dirname, 'dist/'),
    publicPath: '',
  },

  entry: {},

  plugins: [
    new HtmlWebpackPlugin({
      title: 'Home',
      pluginData: {
        teaser: 'Teaser of home page.',
        description: 'Home custom data.',
      },
      template: path.join(__dirname, 'src/index.pug'),
      filename: 'index.html',
    }),

    new HtmlWebpackPlugin({
      title: 'About',
      pluginData: {
        teaser: 'Teaser of about page.',
        description: 'About custom data.',
      },
      template: path.join(__dirname, 'src/about.pug'),
      filename: 'about.html',
    }),
  ],

  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: 'pug-loader',
      },

      {
        test: /\.(png|jpg|jpeg)/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name].[hash:8][ext]',
        },
      },
    ],
  },
};