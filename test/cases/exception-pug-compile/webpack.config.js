module.exports = {
  mode: 'production',
  entry: {
    index: './src/index.js',
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
    ],
  },
};