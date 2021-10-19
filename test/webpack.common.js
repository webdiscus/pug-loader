module.exports = {
  output: {
    filename: '[name].js',
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
        // run test with original pugjs/pug-loader
        //loader: 'pug-loader',

        // relative path by test case directory
        loader: '../../../',
      },
    ],
  },

  optimization: {
    removeEmptyChunks: true,
    mergeDuplicateChunks: true,
    usedExports: true,
    concatenateModules: true,
  },
};