const path = require('path');
const basePath = path.resolve(__dirname);

module.exports = {
  mode: 'production',
  entry: {
    index: './src/index.js',
  },
  plugins: [],
  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: 'pug-loader',
        options: {
          method: 'compile',
        },
      },
    ],
  },
};