const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: 'production',

  output: {
    path: path.join(__dirname, 'dist/'),
    // JS output filename must be defined only here
    filename: 'js/[name].[contenthash:8].js',
  },

  entry: {
    // Source files of styles and scripts must be defined here, separately from their templates.
    // How to bind each generated bundle to the HTML page?
    // Answer: using the `chunks` option hell!
    index: ['./src/views/home/main.js', './src/views/home/style.scss'],
    about: ['./src/views/about/main.js', './src/views/about/style.scss'],
  },

  plugins: [
    // For one page must be initialized the plugin instance.
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/views/home/index.pug'),
      // HTML output filename
      filename: 'index.html',
      // bind the generated JS and CSS files to this template via chunks,
      // this is a very terrible "crutch"
      chunks: ['index'],
      // pass variables into template,
      // access in template is very ugly: `htmlWebpackPlugin.options.data.title`
      data: { title: 'Home' }
    }),


    // For other page must be initialized yet one plugin instance.
    // It's very very bad practice and ugly syntax!
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/views/about/index.pug'),
      // HTML output filename
      filename: 'about.html',
      // bind the generated JS and CSS files to this template via chunks option,
      // you're not confused yet using chunks?
      chunks: ['about'],
      // access in template is very ugly: `htmlWebpackPlugin.options.data.title`,
      // using `pug-plugin`, the variable in Pug is accessible w/o any scope: `title`
      // (of cause, in `pug-plugin` you can define a variable scope, if you want)
      data: { title: 'About' }
    }),

    // ... Do you have the joy of adding yet one page using the HtmlWebpackPlugin?
    // No? Then try to use the `pug-plugin`!

    // Yet one plugin to extract CSS and inject one into HTML.
    new MiniCssExtractPlugin({
      // CSS output filename defined in another place, here
      filename: 'css/[name].[contenthash:8].css',
    }),
  ],

  module: {
    rules: [
      // requires to define the pug loader
      {
        test: /\.pug$/,
        loader: 'pug-loader',
        //loader: '@webdiscus/pug-loader',
      },
      {
        test: /\.(s?css|sass)$/,
        // requires additional MiniCssExtractPlugin loader
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|jpe?g|ico)/,
        type: 'asset/resource',
        generator: {
          filename: 'img/[name].[hash:8][ext]',
        },
      },
    ],
  },
};