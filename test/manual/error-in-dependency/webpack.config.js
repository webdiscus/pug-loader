const path = require('path');
const PugPlugin = require('pug-plugin');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',

  output: {
    path: path.join(__dirname, 'dist'),
  },

  entry: {
    index: 'src/index.pug',
  },

  plugins: [
    // use the pug-plugin to compile pug files defined in entry
    new PugPlugin({
      js: {
        filename: 'assets/js/[name].[contenthash:8].js',
      },
      css: {
        filename: 'assets/css/[name].[contenthash:8].css',
      },
    }),
  ],

  module: {
    rules: [
      {
        test: /\.pug$/,
        //loader: PugPlugin.loader, // the pug-loader is already included in PugPlugin
        loader: '../../../', // use local source of pug-loader for development and test
        options: {
          method: 'render', // fast method to compile Pug files in static HTML
        },
      },

      // styles
      {
        test: /\.(s?css)$/,
        use: ['css-loader', 'sass-loader'],
      },
    ],
  },

  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    watchFiles: {
      paths: ['src/**/*.*'],
      options: {
        usePolling: true,
      },
    },
  },
};