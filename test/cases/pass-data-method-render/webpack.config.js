const path = require('path');
const PugPlugin = require('../../pug-plugin');

const webRootPath = path.join(__dirname, 'public/');

module.exports = {
  mode: 'production',

  output: {
    path: webRootPath,
    publicPath: '',
  },

  entry: {
    index: 'src/index.pug',
  },

  plugins: [new PugPlugin()],

  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: 'pug-loader',
        options: {
          method: 'render',
          data: {
            tmplData: {
              pageTitle: 'Startpage',
              firstName: 'Max',
              lastName: 'Mustermann',
              renderName: (firstName, lastName) => {
                return `Hello ${firstName} ${lastName}!`;
              },
              getKeywords: () => {
                const keywords = ['webpack', 'pug', 'loader'];
                return keywords.join(', ');
              },
              fn1: function () {
                return 'method fn1';
              },
              fn2() {
                return 'method fn2';
              },
            },
          },
        },
      },
    ],
  },
};