## 1.0.0 (Oct 19, 2021)
### First release
- supports **Webpack 5** and **Pug 3**
- support of original `pugjs/pug-loader` features and options
- up to 4x faster than original `pugjs/pug-loader` by starting webpack
- up to 8x faster than original `pugjs/pug-loader` by compile changes in dependencies via watching
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
- supports watching of change in dependencies
- all features have integration tests processed through a webpack runner
