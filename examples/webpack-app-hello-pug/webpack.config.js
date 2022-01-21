const path = require('path');
const PugPlugin = require('pug-plugin');

module.exports = {
  mode: 'production',

  resolveLoader: {
    alias: {
      //'pug-loader': '@webdiscus/pug-loader',
      'pug-loader': path.join(__dirname, '../../'), // use it only for local development
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
      modules: [PugPlugin.extractCss()],
    }),
  ],

  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: 'pug-loader',
        //loader: PugPlugin.loader, // the pug-loader is already included in the PugPlugin
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
        type: 'asset/resource',
        generator: {
          filename: 'assets/css/[name].[hash][ext]',
        },
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
