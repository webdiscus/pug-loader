const path = require('path');
const PugPlugin = require('pug-plugin');
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const basePath = path.resolve(__dirname);
const webRootPath = path.join(basePath, 'public/');

module.exports = {
  mode: 'production',
  context: path.join(__dirname, 'src/'),

  entry: {
    index: 'views/index.pug',
  },

  resolve: {
    plugins: [new TsConfigPathsPlugin({ configFile: path.join(basePath, 'tsconfig.json') })],
    alias: {
      AliasImages: path.join(__dirname, 'src/assets/images/'),
    },
  },

  output: {
    path: webRootPath,
    publicPath: '',
  },

  plugins: [new PugPlugin()],

  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: 'pug-loader',
        options: {
          method: 'compile',
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