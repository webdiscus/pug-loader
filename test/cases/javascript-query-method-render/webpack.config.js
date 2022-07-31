const path = require('path');

module.exports = {
  mode: 'production',

  output: {
    path: path.join(__dirname, 'public/'),
    publicPath: '',
  },

  entry: {
    index: './src/index.js',
  },

  resolve: {
    alias: {
      Includes: path.join(__dirname, 'src/includes/'),
      Images: path.join(__dirname, 'src/images/'),
      Views: path.join(__dirname, 'src/views/'),
    },
  },

  plugins: [],

  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: 'pug-loader',
        options: {
          method: 'render',
          name: 'custom_template_function', // test template function name in generated code
        },
      },
    ],
  },
};