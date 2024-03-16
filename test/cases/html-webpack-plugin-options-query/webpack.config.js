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
      },
      template: path.join(
        __dirname,
        'src/index.pug?dataFromQuery=' + JSON.stringify({ options: { description: 'Home custom data.' } })
      ),
      filename: 'index.html',
    }),

    new HtmlWebpackPlugin({
      title: 'About',
      pluginData: {
        teaser: 'Teaser of about page.',
      },
      template: path.join(
        __dirname,
        'src/about.pug?dataFromQuery=' + JSON.stringify({ options: { description: 'About custom data.' } })
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
          //mode: 'render',
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