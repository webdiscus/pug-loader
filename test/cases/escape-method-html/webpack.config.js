const path = require('path');
const PugPlugin = require('pug-plugin');
const webRootPath = path.join(__dirname, 'public/');

module.exports = {
  mode: 'production',

  output: {
    path: webRootPath,
    publicPath: '',
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
          {
            loader: 'html-loader',
            options: {
              minimize: false,
            },
          },
          {
            loader: 'pug-loader',
            options: {
              method: 'html',
            },
          },
        ],
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