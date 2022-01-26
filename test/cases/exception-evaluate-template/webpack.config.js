const path = require('path');
const webRootPath = path.join(__dirname, 'public/');

module.exports = {
  mode: 'production',

  output: {
    path: webRootPath,
    publicPath: '',
  },

  entry: {
    index: './src/index.pug',
  },

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