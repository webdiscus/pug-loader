const path = require('path');
//const PugPlugin = require('pug-plugin'); // use it in your code
const PugPlugin = require('../../../pug-plugin'); // use local code of pug-plugin for development

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';

  return {
    mode: isProd ? 'production' : 'development',
    devtool: isProd ? 'source-map' : 'inline-source-map',

    resolve: {
      // aliases used in pug, scss, js
      alias: {
        Views: path.join(__dirname, 'src/views/'),
        Images: path.join(__dirname, 'src/assets/images/'),
        Fonts: path.join(__dirname, 'src/assets/fonts/'),
        Styles: path.join(__dirname, 'src/assets/styles/'),
        Scripts: path.join(__dirname, 'src/assets/scripts/'),
      },
    },

    output: {
      path: path.join(__dirname, 'dist'),
      // build for GitHub Page: https://webdiscus.github.io/pug-loader/pug-filters/
      publicPath: isProd ? '/pug-loader/pug-filters/' : '/',
      // output filename of scripts
      filename: 'assets/js/[name].[contenthash:8].js',
    },

    entry: {
      index: 'src/views/pages/home/index.pug',
      escape: 'src/views/pages/escape/index.pug',
      code: 'src/views/pages/code/index.pug',
      highlight: 'src/views/pages/highlight/index.pug',
      markdown: 'src/views/pages/markdown/index.pug',
    },

    plugins: [
      new PugPlugin({
        modules: [
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
          //loader: PugPlugin.loader, // the `pug-plugin` already contains the `@webdiscus/pug-loader`
          loader: '../../',
          options: {
            method: 'render', // fast method to render static html
            // enable embedded filters
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
                use: 'prismjs', // name of a highlighting npm package, must be installed
              },
              // :markdown
              markdown: {
                highlight: {
                  verbose: true,
                  use: 'prismjs', // name of a highlighting npm package, must be installed
                },
              },
            },
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
          include: /assets\/fonts/, // fonts from `assets/fonts` directory only
          generator: {
            // output filename of fonts
            filename: 'assets/fonts/[name][ext][query]',
          },
        },

        // images
        {
          test: /\.(png|svg|jpe?g|webp)$/i,
          type: 'asset/resource',
          include: /assets\/images/, // images from `assets/images` directory only
          generator: {
            // output filename of images
            filename: 'assets/img/[name].[hash:8][ext]',
          },
        },
      ],
    },

    performance: {
      hints: isProd ? 'error' : 'warning',
      // in development mode the size of assets is bigger than in production
      maxEntrypointSize: isProd ? 1024000 : 4096000,
      maxAssetSize: isProd ? 1024000 : 4096000,
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
