const path = require('path');
const PugPlugin = require('../../pug-plugin');

module.exports = {
  stats: {
    children: true,
  },

  mode: 'production',

  output: {
    path: path.join(__dirname, 'dist/'),
    publicPath: '/',
  },

  resolve: {
    alias: {
      // test the prefix only as alias
      '@': path.join(__dirname, './src/assets/'),

      // test the single char as alias
      '&': path.join(__dirname, './src/assets/'),

      // test alias as string
      ImagesA: path.join(__dirname, './src/assets-a/images/'),

      // test alias as string contained a prefix in name
      ImagesB: path.join(__dirname, './src/assets-b/images1/'),
      '~ImagesB': path.join(__dirname, './src/assets-b/images2/'),
      '@ImagesB': path.join(__dirname, './src/assets-b/images3'),

      // test alias as array
      ImagesC: [path.join(__dirname, './src/assets/images/'), path.join(__dirname, './src/assets-c/images/')],

      // test alias as array contained a prefix in name
      ImagesD: [path.join(__dirname, './src/assets/images/'), path.join(__dirname, './src/assets-d/images1/')],
      '~ImagesD': [path.join(__dirname, './src/assets/images/'), path.join(__dirname, './src/assets-d/images2/')],
      '@ImagesD': [path.join(__dirname, './src/assets/images/'), path.join(__dirname, './src/assets-d/images3')],
    },
  },

  entry: {
    index: 'src/index.pug',
  },

  plugins: [new PugPlugin()],

  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: 'pug-loader',
        options: {
          mode: 'compile',
        },
      },

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