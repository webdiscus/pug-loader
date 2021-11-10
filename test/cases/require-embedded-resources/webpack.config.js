const path = require('path');
const basePath = path.resolve(__dirname);

module.exports = {
  stats: {
    children: true,
  },
  mode: 'production',
  entry: {},
  resolve: {
    alias: {
      Source: path.join(basePath, 'src/'),
      Includes: path.join(basePath, 'src/includes/'),
      IncludesParentDir: path.join(basePath, 'src/includes/require-variable-parent-dir/'),
      SourceImages: path.join(basePath, 'src/images/'),
    },
  },
  plugins: [],
  module: {
    rules: [
      // Process image resources in pug templates with webpack
      {
        test: /\.(png|jpg|jpeg)/,
        type: 'asset/resource',
      },
      {
        test: /\.pug$/,
        loader: 'pug-loader',
        options: {
          method: 'compile',
        },
      },
    ],
  },
};