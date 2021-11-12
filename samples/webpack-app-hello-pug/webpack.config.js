const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'production',

  entry: {
    main: './src/main.js',
  },

  output: {
    path: __dirname + '/public',
    filename: '[name].js',
    assetModuleFilename: 'images/[hash][ext][query]',
  },

  plugins: [
    // this plugin extract the content of a pug template
    // and save compiled via pug-loader content into html file
    new HtmlWebpackPlugin({
      template: __dirname + '/src/index.pug',
      filename: 'index.html',
      inject: false,
    }),
  ],

  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: '@webdiscus/pug-loader',
        options: {
          method: 'render',
        },
      },
      // Process image resources in pug templates with webpack
      {
        test: /\.(png|jpg|jpeg)/,
        type: 'asset/resource',
      },
    ],
  },
};
