const path = require('path');
const PugPlugin = require('../../pug-plugin');

module.exports = {
  mode: 'production',

  output: {
    path: path.join(__dirname, 'dist/'),
    publicPath: '/',
  },

  entry: {
    index: 'src/index.pug',
  },

  plugins: [
    new PugPlugin({
      //pretty: true,
    }),
  ],

  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: 'pug-loader',
        options: {
          mode: 'render',
          watchFiles: /\.(s?css)$/i,
          embedFilters: {
            code: {
              className: 'language-',
            },
          },
        },
      },
    ],
  },
};