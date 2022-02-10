const path = require('path');
const PugPlugin = require('../../pug-plugin');
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const basePath = path.resolve(__dirname);
const webRootPath = path.join(__dirname, 'public/');

module.exports = {
  stats: {
    children: true,
  },

  mode: 'production',

  resolve: {
    plugins: [new TsConfigPathsPlugin({ configFile: path.join(basePath, 'tsconfig.json') })],
  },

  output: {
    path: webRootPath,
    publicPath: '',
  },

  entry: {
    index: 'src/template/index.pug',
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
    ],
  },
};