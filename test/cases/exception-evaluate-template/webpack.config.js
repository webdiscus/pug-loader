const path = require('path');

module.exports = {
  mode: 'production',

  output: {
    path: path.join(__dirname, 'public/'),
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
          method: 'render',
        },
      },
    ],
  },
};