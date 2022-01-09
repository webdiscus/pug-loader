const path = require('path');
const basePath = path.resolve(__dirname);

module.exports = {
  resolveLoader: {
    alias: {
      'pug-loader': '@webdiscus/pug-loader',
      //'pug-loader': path.join(basePath, '../../'), // use it only for local development
    },
  },

  module: {
    rules: [
      // {
      //   test: /\.pug$/,
      //   loader: 'pug-loader',
      //   options: {
      //     method: 'render',
      //     doctype: 'html',
      //     plugins: [require('pug-plugin-ng')],
      //   },
      // },

      {
        test: /\.pug$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              esModule: false,
            },
          },
          {
            loader: 'pug-loader',
            options: {
              method: 'html',
              doctype: 'html',
              plugins: [require('pug-plugin-ng')],
            },
          },
        ],
      },

      // Process image resources in pug templates with webpack
      {
        test: /\.(png|jpg|jpeg)/,
        type: 'asset/resource',
      },
    ],
  },
};
