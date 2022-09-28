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
  publicPath: 'auto',
  transpileDependencies: true,

  chainWebpack: (config) => {
    // IMPORTANT: clear all existing pug loader settings to add new @webdiscus/pug-loader,
    // defaults pug loader is the `pug-plain-loader`
    const pugRule = config.module.rule('pug');
    pugRule.uses.clear();
    pugRule.oneOfs.clear();

    // MEGA IMPORTANT for build in production mode:
    // Vue use the buggy `thread-loader` that try to call all loaders via Worker,
    // but the `pug-loader` can't work in Worker, because is async and use Webpack API.
    // We need to exclude `pug-loader` from the witchery of the baggy `thread-loader`.
    const jsRule = config.module.rule('js');
    jsRule.exclude.add(/pug-loader/);
  },

  runtimeCompiler: true,
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.pug$/,
          oneOf: [
            // allow <template lang="pug"> in Vue components
            {
              resourceQuery: /^\?vue/u,
              loader: '@webdiscus/pug-loader',
              options: {
                method: 'html', // render Pug into pure HTML string
                ...pugLoaderOptions,
              },
            },
            // allow import of Pug in JavaScript
            {
              loader: '@webdiscus/pug-loader',
              options: {
                method: 'compile', // compile Pug into template function
                ...pugLoaderOptions,
              },
            },
          ],
        },
      ],
    },
  },
});
