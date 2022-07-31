const path = require('path');
const PugPlugin = require('../../pug-plugin');
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  mode: 'production',
  context: path.join(__dirname, 'src/'),

  entry: {
    index: 'views/index.pug',
  },

  resolve: {
    plugins: [new TsConfigPathsPlugin({ configFile: path.join(__dirname, 'tsconfig.json') })],
    alias: {
      AliasImages: path.join(__dirname, 'src/assets/images/'),
    },
  },

  output: {
    path: path.join(__dirname, 'public/'),
    publicPath: '',
  },

  plugins: [new PugPlugin()],

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