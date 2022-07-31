const path = require('path');
const PugPlugin = require('../../pug-plugin');

module.exports = {
  stats: {
    children: true,
  },

  mode: 'production',

  resolve: {
    alias: {
      Source: path.join(__dirname, 'src/'),
      SourceImages: path.join(__dirname, 'src/images/'),
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
          //method: 'render',
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