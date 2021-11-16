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
          method: 'render',
          esModule: true,
          data: {
            globalVar: 'Global Title!',
            a: 7,
            b: 'zzz',
          },
        },
      },

      // Process image resources in pug templates with webpack
      {
        test: /\.(png|jpg|jpeg)/,
        type: 'asset/resource',
      },
    ],
  },
};