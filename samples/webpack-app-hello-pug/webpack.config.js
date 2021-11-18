const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'production',

  entry: {
    main: './src/main.js',
  },

  output: {
    path: path.join(__dirname, 'public'),
    filename: '[name].js',
  },

  resolveLoader: {
    alias: {
      'pug-loader': '@webdiscus/pug-loader',
      //'pug-loader': path.join(__dirname, '../../'), // use it only for local development
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

  plugins: [
    // this plugin extract the content of a pug template
    // and save compiled via pug-loader content into html file
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/templates/index.pug'),
      filename: 'index.html',
      inject: false,
    }),
  ],

  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: 'pug-loader',
        options: {
          //method: 'render',
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
          filename: 'assets/css/[hash][ext][query]',
        },
      },
    ],
  },

  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 9000,
    https: false,
    // open in default browser
    open: true,
    // define a development browser
    /*open: {
      app: {
        name: 'Firefox',
      },
    },*/
    liveReload: true,

    client: {
      progress: true,
    },
  },
};
