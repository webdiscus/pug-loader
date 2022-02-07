const path = require('path');
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const basePath = path.resolve(__dirname);

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
    plugins: [new TsConfigPathsPlugin({ configFile: path.join(basePath, 'tsconfig.json') })],
    alias: {
      Images: path.join(basePath, 'src/assets/images/'),
      Includes: path.join(basePath, 'src/includes/'),
      Template: path.join(basePath, 'src/template/'),
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
          data: {
            globalVar: 'Global Title!',
            a: 7,
            b: 'zzz',
          },
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