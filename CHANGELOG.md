# Change log

## 1.4.6 (2021-12-06)
- cleanup: remove needles console.log, cleanup code 
- devDeps: update packages
- docs: minor update readme
- tests: add tests for an exception and an option
- tests: refactoring test utils

## 1.4.5 (2021-11-22)
- improvement: optimization of `render` and `html` methods
- bugfix: fix require() for CommonJS module. Now is possible use the CommonJS module directly in the pug, e.g.:
  ```pug
  - var someModule = require('some-module');
  p #{ someModule.sayHello('PUG') }
  ```
- bugfix: fix 'Unexpected token' by render method
- bugfix: fix 'Unterminated string' by render method

## 1.4.4 (2021-11-19)
- compatibility: add polyfill `replaceAll()` for node.js < 15
- bugfix: fix for the parsing multiple `require` in a single string code

## 1.4.3 (2021-11-18)
- update: minor code update and cleanup

## 1.4.2 (2021-11-18)
- feature: now supports require of JS and JSON data files in pug at compile time, e.g.:
  ```pug
  - var someData = require('some-data.json');
  each item in someData
    p= item.anyProperty
  ```
- bugfix: fix issues by samples

## 1.4.1 (2021-11-17)
- improvement: inner optimizations for the `render` method
- update: code cleanup

## 1.4.0 (2021-11-16)
- feature: added the option `esModule` to enable/disable ES modules syntax in generated JS modules
- improvement: some code improvements

## 1.3.1 (2021-11-15)
- update package version for samples

## 1.3.0 (2021-11-15)
- feature: the `render` method has been improved. Now the method render a pug into HTML really at compile time without limitations for resolving an embedded resource.
  This method do same result as any other pug-loader + html-loader, even faster, generate smaller code and with all that not need an additional loader.
- update: some code and test refactorings

## 1.2.0 (2021-11-12)
- feature: added for the loader option `method` new value `html` to render the template function into pure HTML string,\
  this method require additional loader, e.g. `html-loader`
- update: added directory with samples for usage this loader with Angular Component

## 1.1.1 (2021-11-10)
- bugfix: fix config for tests
- update: cleanup tests

## 1.1.0 (2021-11-10)
- feature: usage of `compile` or `render` methods in JavaScript:  
  - added loader option `method: render|compile` to render into HTML or compile into a template function all templates required in js file
  - in the js require() can be used the query parameter `?pug-render` to render the pug template directly into HTML, independent of loader option `method`, \
    e.g. `const html = require('template.pug?pug-render')`
  - in the js require() query can be used the query parameter `?pug-compile`to compile the pug template into a template function, independent of loader option `method`, \
    e.g. `const tmpl = require('template.pug?pug-compile')`
- feature: pass a custom data into a template at compile time: 
  - added loader option `data: {}` to pass a data into all templates at compile time, e.g. useful for the i18n data
  - in the js require () query you can use URL `key=value` or JSON `{key:value}` parameters to pass them into the template at compile time, \
    e.g. `const tmpl = require('template.pug?key1=value1&{"key2":"value2","key3":"value3"}')`
- update: dependencies in package.json

## 1.0.3 (2021-10-21)
- update: added missed dependency for test
- update: dependencies for test
- update: readme

## 1.0.2 (2021-10-20)
- update: added the test case to cover the `pugjs/pug-loader` [issue](https://github.com/pugjs/pug-loader/issues/123) : `Module not found: Error: Can't resolve` when use a mixin and require on same file.\
  note: this pug-loader work fine und hasn't this issue. Here is just added the test case for the problem of pugjs/pug-loader to be sure that this problem doesn't occur in this pug-loader.

## 1.0.1 (2021-10-20)
- update: devDependencies in `package.json`
- update: readme
- update: cleanup code

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
