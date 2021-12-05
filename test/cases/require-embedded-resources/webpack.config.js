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
      {
        test: /\.pug$/,
        loader: 'pug-loader',
        options: {
          method: 'compile',
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