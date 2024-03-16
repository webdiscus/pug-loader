const path = require('path');
const PugPlugin = require('../../pug-plugin');

module.exports = {
  mode: 'production',

  output: {
    path: path.join(__dirname, 'dist'),
  },

  entry: {
    index: './src/index.pug',
  },

  plugins: [new PugPlugin()],

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
              className: 'language-',
            },
            // :highlight
            highlight: {
              verbose: true,
              use: 'prismjs', // name of highlighting npm package, must be installed
            },
            // :markdown
            markdown: {
              highlight: {
                verbose: true,
                use: 'prismjs', // name of highlighting npm package, must be installed
              },
            },
          },
        },
      },
      {
        test: /\.(s?css|sass)$/,
        use: ['css-loader', 'sass-loader'],
      },
    ],
  },
};