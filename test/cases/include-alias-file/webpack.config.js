const path = require('path');
const PugPlugin = require('../../pug-plugin');

const webRootPath = path.join(__dirname, 'public/');

module.exports = {
  mode: 'production',

  resolve: {
    alias: {
      ALIAS_TO_SCRIPT: path.resolve(__dirname, 'src/includes/script.js'),
      ALIAS_TO_SCRIPT_TS: path.resolve(__dirname, 'src/includes/script.ts'),
    },
  },

  output: {
    path: webRootPath,
    publicPath: '',
  },

  entry: {
    index: 'src/views/index.pug',
  },

  plugins: [
    new PugPlugin({
      pretty: true,
    }),
  ],

  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: 'pug-loader',
        options: {
          method: 'render',
          embedFilters: {
            // :escape
            escape: true,
            // :code
            code: {
              className: 'lang',
            },
          },
        },
      },
    ],
  },
};