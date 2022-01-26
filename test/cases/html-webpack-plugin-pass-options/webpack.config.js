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
      title: 'My title', // this option is in pug template not available
      // pass into template the variables via query,
      // because at render time the variable `htmlWebpackPlugin` still not exists
      template: path.join(
        __dirname,
        'src/index.pug?htmlWebpackPlugin=' + JSON.stringify({ options: { title: 'My title' } })
      ),
      filename: 'index.html',
    }),
  ],

  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: 'pug-loader',
      },

      {
        test: /\.(png|jpg|jpeg)/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name].[hash:8][ext]',
        },
      },
    ],
  },
};