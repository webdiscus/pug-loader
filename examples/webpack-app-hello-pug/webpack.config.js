const path = require('path');
const PugPlugin = require('pug-plugin');
//const PugPlugin = require('../../../pug-plugin'); // for local development only

module.exports = {
  mode: 'production',

  resolveLoader: {
    alias: {
      //'pug-loader': PugPlugin.loader, // the pug-loader is already included in the PugPlugin
      'pug-loader': path.join(__dirname, '../../'), // for local development only
    },
  },

  resolve: {
    // aliases used in the code example
    alias: {
      App: path.join(__dirname, 'src/app/'),
      Images: path.join(__dirname, 'src/assets/images/'),
      Styles: path.join(__dirname, 'src/assets/css/'),
      Templates: path.join(__dirname, 'src/templates/'),
    },
  },

  output: {
    path: path.join(__dirname, 'public'),
    publicPath: '',
    filename: '[name].js',
  },

  entry: {
    main: './src/main.js',
    index: 'src/templates/index.pug',
  },

  plugins: [
    // extract HTML from pug files defined by webpack entry
    new PugPlugin({
      // extract CSS from required styles in pug and from webpack entry
      modules: [
        PugPlugin.extractCss({
          filename: 'assets/css/[name].[contenthash:8].css',
        }),
      ],
    }),
  ],

  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: 'pug-loader',
        options: {
          method: 'render',
          esModule: true,
        },
      },
      // image resources processing
      {
        test: /\.(png|jpg|jpeg|ico)/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/img/[hash][ext][query]',
        },
      },
      // styles processing
      {
        test: /\.(css)/,
        use: ['css-loader'],
      },
    ],
  },

  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    port: 9000,
    https: false,
    liveReload: true,
    hot: true,
    client: {
      progress: true,
    },
    compress: true,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
    // open in default browser
    open: true,
    // open: {
    //   app: {
    //     name: 'Firefox',
    //   },
    // },
  },
};
