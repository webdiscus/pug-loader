# Change log

## 1.3.0 (2021-11-15)
- feature: the `render` method has been improved. Now the method render a pug into HTML really at compile time without limitations for resolving an embedded resource.
  This method do same result as any other pug-loader + html-loader, even faster, generate smaller code and with all that not need an additional loader.
- some code and test refactorings

## 1.2.0 (2021-11-12)
- feature: added for the loader option `method` new value `html` to render the template function into pure HTML string,\
  this method require additional loader, e.g. `html-loader`, see usage sample in readme
- added directory with samples for usage this loader with Angular Component

## 1.1.1 (2021-11-10)
- fix config for tests
- cleanup tests

## 1.1.0 (2021-11-10)
- feature `compile` or `render` method by usage in JavaScript:  
  - added loader option `method: render|compile` to render into HTML or compile into a template function all templates required in js file
  - in the js require() can be used the query parameter `?pug-render` to render the pug template directly into HTML, independent of loader option `method`, \
    e.g. `const html = require('template.pug?pug-render')`
  - in the js require() query can be used the query parameter `?pug-compile`to compile the pug template into a template function, independent of loader option `method`, \
    e.g. `const tmpl = require('template.pug?pug-compile')`
- feature for pass a custom data into a template at compile time: 
  - added loader option `data: {}` to pass a data into all templates at compile time, e.g. useful for the i18n data
  - in the js require () query you can use URL `key=value` or JSON `{key:value}` parameters to pass them into the template at compile time, \
    e.g. `const tmpl = require('template.pug?key1=value1&{"key2":"value2","key3":"value3"}')`
- update dependencies

## 1.0.3 (2021-10-21)
- added missed dependency for test
- update dependencies for test
- update readme

## 1.0.2 (2021-10-20)
- added the test case to cover the `pugjs/pug-loader` [issue](https://github.com/pugjs/pug-loader/issues/123) : `Module not found: Error: Can't resolve` when use a mixin and require on same file.\
  Note: this pug-loader work fine und hasn't this issue. Here is just added the test case for the problem of pugjs/pug-loader to be sure that this problem doesn't occur in this pug-loader.

## 1.0.1 (2021-10-20)
- update devDependencies in `package.json`
- update readme
- cleanup code

## 1.0.0 (2021-10-19)
First release
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
