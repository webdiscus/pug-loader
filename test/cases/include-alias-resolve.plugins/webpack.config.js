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
    alias: {},
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
      },
    ],
  },
};