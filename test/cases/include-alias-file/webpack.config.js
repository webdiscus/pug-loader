const path = require('path');
const PugPlugin = require('../../pug-plugin');

module.exports = {
  mode: 'production',

  resolve: {
    alias: {
      ALIAS_CONTEXT_DIR: '/src/includes/',
      ALIAS_CONTEXT_FILE: '/src/includes/text.txt',
      ALIAS_FILE: path.resolve(__dirname, 'src/includes/text.txt'),
      ALIAS_EXTERNAL_FILE: path.resolve(__dirname, '../../fixtures/text.txt'),
      ALIAS_SCRIPT_MAIN: path.resolve(__dirname, 'src/scripts/main.js'),
      ALIAS_SCRIPT_VENDOR: path.resolve(__dirname, 'src/scripts/vendor.js'),
    },
  },

  output: {
    path: path.join(__dirname, 'dist/'),
    publicPath: '',
  },

  entry: {
    index: 'src/views/index.pug',
  },

  plugins: [
    new PugPlugin({
      //pretty: true,
      js: {
        filename: 'assets/[name].js',
      },
    }),
  ],

  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: 'pug-loader',
        options: {
          mode: 'render',
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