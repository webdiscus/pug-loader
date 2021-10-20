# Change log

## 1.0.2 (2021-10-20)
- added the test case to cover the `pugjs/pug-loader` [issue](https://github.com/pugjs/pug-loader/issues/123) : `Module not found: Error: Can't resolve` when use a mixin and require on same file.\
  Note: this pug-loader work fine und hasn't this issue. Here is just added the test case for the problem of pugjs/pug-loader to be sure that this problem doesn't occur in this pug-loader.

## 1.0.1 (2021-10-20)
- update devDependencies in `package.json`
- update readme
- code cleanup

## 1.0.0 (2021-10-19)
### First release
- supports **Webpack 5** and **Pug 3**
- supports all features and options of original `pugjs/pug-loader`
- up to 4x faster than original `pugjs/pug-loader` at webpack starting
- up to 8x faster than original `pugjs/pug-loader` at webpack watching during compile changes in dependencies
- supports Webpack `resolve.alias`, work fine with and without the prefixes `~` or `@`, e.g. this works:
  - `extends UIComponents/layout.pug`
  - `extends ~UIComponents/layout.pug`
  - `extends @UIComponents/layout.pug`
  - `include UIComponents/mixins.pug`
  - `include ~UIComponents/mixins.pug`
  - `include @UIComponents/mixins.pug`
  - `include:markdown-it UIComponents/components.md`
  - `- const colors = require('UIComponents/colors.json')`
  - `img(src=require('UIComponents/image.jpeg'))`
  - `const tmpl = require('UIComponents/index.pug');`
- supports watching of changes in all dependencies
- all features have integration tests processed through a webpack runner
