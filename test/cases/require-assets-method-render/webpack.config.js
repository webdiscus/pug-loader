const path = require('path');
const PugPlugin = require('pug-plugin');

module.exports = {
  mode: 'production',

  output: {
    path: path.join(__dirname, 'public/'),
    publicPath: '',
  },

  entry: {
    index: './src/pages/index.pug',
  },

  plugins: [
    new PugPlugin({
      modules: [PugPlugin.extractCss()],
    }),
  ],

  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: PugPlugin.loader,
        options: {
          method: 'render',
          esModule: true, // Test: transformation of ESM to CommonJS source in PugPlugin.extractHtml
        },
      },

      {
        test: /\.(css|sass|scss)$/,
        type: 'asset/resource',
        generator: {
          // save required styles
          filename: 'assets/css/[name].[contenthash:8].css',
        },
        use: [
          {
            loader: 'css-loader',
          },
        ],
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