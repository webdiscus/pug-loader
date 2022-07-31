module.exports = {
  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: '@webdiscus/pug-loader',
        options: {
          method: 'render',
          doctype: 'html',
          plugins: [require('pug-plugin-ng')],
        },
      },

      {
        test: /\.(png|jpg|jpeg)/,
        type: 'asset/resource',
      },
    ],
  },
};
