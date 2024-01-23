const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const locales = {
  en: {
    "hello": "Hello"
  },
  de: {
    "hello": "Hallo"
  },
  fr: {
    "hello": "Bonjour"
  },
};

module.exports = {
  mode: 'production',

  entry: {},

  output: {
    path: path.join(__dirname, 'public/'),
    publicPath: '',
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.pug') + `?lang=en`,
      filename: `en/index.html`,
      data: locales.en,
      cache: false,
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.pug') + `?lang=de`,
      filename: `de/index.html`,
      data: locales.de,
      cache: false,
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.pug') + `?lang=fr`,
      filename: `fr/index.html`,
      data: locales.fr,
      cache: false,
    }),
  ],

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