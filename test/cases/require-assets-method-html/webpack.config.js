const fs = require('fs');
const path = require('path');
const PugPlugin = require('pug-plugin');

module.exports = {
  mode: 'production',

  output: {
    path: path.join(__dirname, 'public/'),
    publicPath: '/',
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
        use: [
          {
            loader: 'html-loader',
            options: {
              // Test: transformation of ESM to CommonJS source in PugPlugin.extractHtml
              esModule: true,
              sources: {
                // Static resource URL from public web path should not be parsed.
                // Leave as is:
                //   img(src='/assets/image.jpg')
                //   link(rel='stylesheet' href='assets/styles.css')
                // Must be processed:
                //   img(src=require('./image.jpg'))
                //   link(rel='stylesheet' href=require('./styles.css'))
                urlFilter: (attribute, value) => path.isAbsolute(value) && fs.existsSync(value),
              },
            },
          },
          {
            //loader: PugPlugin.loader,
            loader: 'pug-loader', // local dev
            options: {
              method: 'html',
            },
          },
        ],
      },

      {
        test: /\.(css|sass|scss)$/,
        type: 'asset/resource', // process required scss/css in pug
        generator: {
          filename: 'assets/css/[name].[contenthash:8].css',
        },
        use: [
          {
            loader: 'css-loader',
          },
        ],
      },

      {
        test: /\.(png|jpg|jpeg)/,
        type: 'asset/resource', // process required images in pug
        generator: {
          filename: 'assets/images/[name].[hash:8][ext]',
        },
      },
    ],
  },
};