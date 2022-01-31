const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const webRootPath = path.join(__dirname, 'public/');

module.exports = {
  mode: 'production',

  output: {
    path: webRootPath,
    publicPath: '',
  },

  entry: {},

  plugins: [
    new HtmlWebpackPlugin({
      title: 'Startseite',
      tmplData: {
        lang: 'de-DE',
      },
      template: path.join(
        __dirname,
        'src/index.pug?dataFromQuery=' + JSON.stringify({ options: { description: 'Benutzerdefinierte Homepage' } })
      ),
      filename: 'index.html',
    }),

    new HtmlWebpackPlugin({
      title: 'About',
      tmplData: {
        lang: 'en-US',
      },
      template: path.join(
        __dirname,
        'src/about.pug?dataFromQuery=' + JSON.stringify({ options: { description: 'Custom about page' } })
      ),
      filename: 'about.html',
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