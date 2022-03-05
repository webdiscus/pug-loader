const path = require('path');
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  mode: 'production',

  output: {
    path: path.join(__dirname, 'public/'),
    publicPath: '',
  },

  entry: {
    index: './src/index.js',
  },

  resolve: {
    plugins: [
      new TsConfigPathsPlugin({
        configFile: path.join(__dirname, 'tsconfig.json'),
        // ATTENTIONS
        // if you require a js file w/o extension via alias from tsconfig, like `var data = require('@data/colors')`
        // then the omitted extension must be defined in the option:
        extensions: ['.js'],
      }),
    ],
    alias: {
      Images: path.join(__dirname, 'src/assets/images/'),
      Data: path.join(__dirname, 'src/data/'),
      Templates: path.join(__dirname, 'src/template/'),
    },
  },

  plugins: [],

  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: 'pug-loader',
        options: {
          method: 'compile',
          basedir: path.join(__dirname, 'src/'),
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