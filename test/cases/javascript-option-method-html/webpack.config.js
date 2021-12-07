const path = require('path');
const basePath = path.resolve(__dirname);

module.exports = {
  mode: 'production',

  output: {
    path: path.join(__dirname, 'public/'),
    publicPath: '',
  },

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

        use: [
          {
            loader: 'html-loader',
            options: {
              esModule: false,
            },
          },

          {
            loader: 'pug-loader',
            options: {
              method: 'html',
              data: {
                globalVar: 'Global Title!',
                a: 7,
                b: 'zzz',
              },
            },
          },
        ],
      },

      // Process image resources in pug templates with webpack
      {
        test: /\.(png|jpg|jpeg)/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name]-[hash][ext]',
        },
      },
    ],
  },
};