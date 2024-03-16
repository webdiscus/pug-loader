const path = require('path');
const PugPlugin = require('pug-plugin');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',

  output: {
    path: path.join(__dirname, 'dist'),
  },

  entry: {
    index: './src/index.pug',
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
          watchFiles: [
            // add to watch all source samples from the `/deps` folder
            /\/deps\/.+$/,
            // add to watch styles included in pug
            /\.(s*css)$/i,
          ],
          // enable filters only those used in pug
          embedFilters: {
            // :escape
            escape: true,
            // :code
            code: {
              className: 'language-',
            },
            // :highlight
            highlight: {
              verbose: true,
              use: 'prismjs', // name of highlighting npm package, must be installed
            },
            // :markdown
            markdown: {
              highlight: {
                verbose: true,
                use: 'prismjs', // name of highlighting npm package, must be installed
              },
            },
          },
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