const path = require('path');
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
    alias: {
      Includes: path.join(basePath, 'src/includes/'),
      Images: path.join(basePath, 'src/images/'),
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
          method: 'render',
          esModule: false,
          data: {
            globalVar: 'Global Title!',
            a: 7,
            b: 'zzz',
          },
        },
      },

      // process required images in pug
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