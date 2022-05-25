const { defineConfig } = require('@vue/cli-service');

// additional pug-loader options, e.g. to enable pug filters such as `:highlight`, `:markdown`, etc.
// see https://github.com/webdiscus/pug-loader#options
const pugLoaderOptions = {
  // enable embedded pug filters
  embedFilters: {
    // enable :highlight filter
    highlight: {
      use: 'prismjs',
    },
    // enable :markdown filter with highlighting
    markdown: {
      highlight: {
        use: 'prismjs',
      },
    },
  },
};

module.exports = defineConfig({
  transpileDependencies: true,

  chainWebpack: (config) => {
    const pugRule = config.module.rule('pug');

    // clear all existing pug loaders
    pugRule.uses.clear();
    pugRule.oneOfs.clear();
  },

  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.pug$/,
          oneOf: [
            // allow import of Pug in JavaScript
            {
              exclude: /\.vue$/,
              loader: '@webdiscus/pug-loader',
              options: {
                method: 'compile', // compile Pug into template function
                ...pugLoaderOptions,
              },
            },
            // allow <template lang="pug"> in Vue components
            {
              loader: '@webdiscus/pug-loader',
              options: {
                method: 'html', // render Pug into pure HTML string
                ...pugLoaderOptions,
              },
            },
          ],
        },
      ],
    },
  },
});
