const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const webRootPath = path.join(__dirname, 'public/');

module.exports = {
  mode: 'production',

  output: {
    path: webRootPath,
    publicPath: '',
  },

  entry: {},

  plugins: [
    new HtmlWebpackPlugin({
      title: 'My title',
      template: path.join(__dirname, 'src/index.pug'),
      // use following with method `render` or `html`:
      //template: path.join(__dirname, 'src/index.pug?htmlWebpackPlugin={"options":{"title":"My title"}}'),
      filename: 'index.html',
    }),
  ],

  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: 'pug-loader',
        options: {
          // ACHTUNG:
          // the object `htmlWebpackPlugin` will be passed only into a template function at runtime
          // via the plugin HtmlWebpackPlugin.
          // The template function is generated with the method `compile` only. Default option method is `compile`.
          //method: 'compile', // defaults method, don't need to define the option
          //
          // If you use the method `render` or `html`, then the loader render the template into HTML at compile time,
          // before the plugin HtmlWebpackPlugin will be called.
          // Therefore, pass a custom data via query string, e.g.:
          // 'src/index.pug?htmlWebpackPlugin={"options":{"title":"My title"}}'
          // or simple 'src/index.pug?title=My title', then use in pug: div= title
          //method: 'render',
        },
      },
    ],
  },
};