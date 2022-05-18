const path = require('path');
const PugPlugin = require('pug-plugin');

module.exports = (env, argv) => {
  return {
    mode: 'development',
    devtool: 'inline-source-map',

    //stats: 'errors-only',

    output: {
      path: path.join(__dirname, 'public'),
      publicPath: '/',
      // output filename of scripts
      filename: 'assets/js/[name].[contenthash:8].js',
    },

    entry: {
      index: 'src/index.pug',
    },

    plugins: [
      // use the pug-plugin to compile pug files defined in entry
      new PugPlugin({
        //verbose: true, // output information about the process to console
        modules: [
          // the `extractCss` module extracts CSS from source style files
          // you can require source style files directly in Pug
          PugPlugin.extractCss({
            // output filename of styles
            filename: 'assets/css/[name].[contenthash:8].css',
          }),
        ],
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
          test: /\.(css|sass|scss)$/,
          use: ['css-loader', 'sass-loader'],
        },
      ],
    },

    devServer: {
      static: {
        directory: path.join(__dirname, 'public'),
      },
      port: 8080,
      https: false,
      compress: true,

      watchFiles: {
        paths: ['src/**/*.*'],
        options: {
          usePolling: true,
        },
      },

      // open in default browser
      //open: true,
    },
  };
};