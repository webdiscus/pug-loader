const path = require('path');
const PugPlugin = require('pug-plugin');

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';

  return {
    mode: isProd ? 'production' : 'development',
    devtool: isProd ? 'source-map' : 'inline-source-map',

    resolve: {
      // aliases used in sources of pug, scss, js
      alias: {
        App: path.join(__dirname, 'src/app/'),
        Views: path.join(__dirname, 'src/views/'),
        Images: path.join(__dirname, 'src/assets/images/'),
        Fonts: path.join(__dirname, 'src/assets/fonts/'),
        Styles: path.join(__dirname, 'src/assets/styles/'),
        Scripts: path.join(__dirname, 'src/assets/scripts/'),
      },
    },

    output: {
      path: path.join(__dirname, 'public'),
      publicPath: '/',
      // output filename of scripts
      filename: 'assets/js/[name].[contenthash:8].js',
    },

    entry: {
      // !!! ATTENTION !!!
      //
      // All source files of styles and scripts, required in Pug, will be automatically processed by webpack.
      // Use your scripts and styles directly in Pug, so easy:
      //   - link(href=require('./styles.scss') rel='stylesheet')
      //   - script(src=require('./main.js'))
      //
      // Don't define styles and js files in entry! You can require source files of js and scss directly in Pug.
      // Don't use `html-webpack-plugin` to render Pug files in HTML! Pug plugin do it directly from here and much faster.
      // Don't use `mini-css-extract-plugin` to extract CSS from styles! Pug plugin extract CSS from source styles required in Pug.

      // Please, see more details under https://github.com/webdiscus/pug-plugin

      // Yes, You can define Pug files directly here, in entry, so easy:
      index: 'src/views/pages/home/index.pug',
    },

    plugins: [
      // use the pug-plugin to compile pug files defined in entry
      new PugPlugin({
        verbose: true, // output information about the process to console
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
          loader: PugPlugin.loader, // the pug-loader is already included in PugPlugin
          options: {
            method: 'render', // fast method to compile Pug files in static HTML
          },
        },

        // styles
        {
          test: /\.(css|sass|scss)$/,
          use: ['css-loader', 'sass-loader'],
        },

        // fonts
        {
          test: /\.(woff2?|ttf|otf|eot|svg)$/,
          type: 'asset/resource',
          include: /assets\/fonts/, // handles fonts from `assets/fonts` directory only
          generator: {
            // output filename of fonts
            filename: 'assets/fonts/[name][ext][query]',
          },
        },

        // images
        {
          test: /\.(png|svg|jpe?g|webp)$/i,
          type: 'asset/resource',
          include: /assets\/images/, // handle images from `assets/images` directory only
          generator: {
            // output filename of images
            filename: 'assets/img/[name].[hash:8][ext]',
          },
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
      open: true,
    },
  };
};
