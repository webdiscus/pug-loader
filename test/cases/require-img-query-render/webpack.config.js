const path = require('path');
const PugPlugin = require('../../pug-plugin');

module.exports = {
  stats: {
    children: true,
  },

  mode: 'production',

  output: {
    path: path.join(__dirname, 'dist/'),
    publicPath: '/',
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
          mode: 'render',
        },
      },

      {
        test: /\.(png|jpg|jpeg)/,
        type: 'asset/resource',
        use: {
          loader: 'responsive-loader',
          options: {
            // image output filename
            name: 'img/[name]-[width]w.[ext]',
            //name: 'img/[name].[hash:8]-[width]w.[ext]', // note: GitHub generate different hash
          },
        },
      },
    ],
  },
};