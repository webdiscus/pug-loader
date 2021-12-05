const path = require('path');
const basePath = path.resolve(__dirname);

module.exports = {
  mode: 'production',
  entry: {
    index: './src/index.js',
  },
  resolve: {
    alias: {
      Includes: path.join(basePath, 'src/includes/'),
      Images: path.join(basePath, 'src/images/'),
      Template: path.join(basePath, 'src/template/'),
    },
  },
  plugins: [],
  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: 'pug-loader',
        options: {
          method: 'rtRender',
        },
      },
      // process image resources in pug templates
      {
        test: /\.(png|jpg|jpeg)/,
        type: 'asset/resource',
      },
    ],
  },
};