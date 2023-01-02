const path = require('path');
const PugPlugin = require('../../pug-plugin');

module.exports = {
  mode: 'production',
  devtool: false,

  output: {
    path: path.join(__dirname, 'public/'),
    publicPath: '/',
  },

  resolve: {
    alias: {
      Scripts: path.join(__dirname, 'src/assets/scripts/'),
      ScriptsContext: '/src/assets/scripts/',
    },
  },

  entry: {
    index: './src/views/index.pug',
  },

  plugins: [
    new PugPlugin({
      js: {
        filename: 'assets/[name].[contenthash:8].js',
      },
    }),
  ],

  module: {
    rules: [
      {
        test: /\.pug$/,
        use: [
          'html-loader',
          {
            loader: 'pug-loader',
            options: {
              method: 'html',
            },
          },
        ],
      },
    ],
  },
};