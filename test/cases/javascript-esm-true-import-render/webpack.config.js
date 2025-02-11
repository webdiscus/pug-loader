const path = require('path');

module.exports = {
  mode: 'production',

  output: {
    path: path.join(__dirname, 'dist/'),
    publicPath: '',
  },

  entry: {
    index: './src/index.js',
  },

  resolve: {
    alias: {
      Includes: path.join(__dirname, 'src/includes/'),
      Images: path.join(__dirname, 'src/images/'),
      Views: path.join(__dirname, 'src/views/'),
    },
  },

  plugins: [],

  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: 'pug-loader',
        options: {
          mode: 'render',
          esModule: true,
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