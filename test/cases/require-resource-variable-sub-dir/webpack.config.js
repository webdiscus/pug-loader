const path = require('path');
const PugPlugin = require('pug-plugin');
const basePath = path.resolve(__dirname);

module.exports = {
  stats: {
    children: true,
  },

  mode: 'production',

  resolve: {
    alias: {
      Source: path.join(basePath, 'src/'),
      Includes: path.join(basePath, 'src/includes/'),
      SourceImages: path.join(basePath, 'src/images/'),
    },
  },

  output: {
    path: path.join(__dirname, 'public/'),
    publicPath: '',
  },

  entry: {
    index: 'src/includes/template/index.pug',
  },

  plugins: [new PugPlugin()],

  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: 'pug-loader',
        options: {
          method: 'compile',
        },
      },

      // process required images in pug
      {
        test: /\.(png|jpg|jpeg)/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name].[hash:8][ext]',
        },
      },
    ],
  },
};