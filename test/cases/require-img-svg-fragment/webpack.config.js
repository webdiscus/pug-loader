const path = require('path');
const PugPlugin = require('../../pug-plugin');

module.exports = {
  stats: {
    children: true,
  },

  mode: 'production',

  output: {
    path: path.join(__dirname, 'dist/'),
    publicPath: '/',
  },

  entry: {
    index: 'src/index.pug',
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
        test: /\.(png|jpe?g|svg)$/,
        type: 'asset/resource',
        generator: {
          //filename: 'assets/images/[name].[hash:8][ext][fragment][query]',
          filename: 'assets/images/[name].[hash:8][ext][query]',
        },
      },
    ],
  },
};