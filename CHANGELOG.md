# Change log

## 1.8.0 (2022-03-05)
### Resolving and watching improvements
- resolve the variable contained a sub directory in the relative path
  ```pug
  - var file = './subdir/image.jpg';
  img(src=require(file))
  ```
- resolve a required path in the variable
  ```pug
  - var file = require('./subdir/image.jpg');
  img(src=file)
  ```
- watching of required `js` and `json` files in pug

## 1.7.4 (2022-02-20)
- code refactoring and internal optimization
- update readme

## 1.7.3 (2022-02-19)
- fix collision with local variables passed in template function for compile method

## 1.7.2 (2022-02-19)
- fix path error in Windows when watching dependencies
- update packages

## 1.7.1 (2022-02-10)
- added support for webpack alias an array of paths, [#10](https://github.com/webdiscus/pug-loader/issues/10)
- fix optional prefix of alias in request when an alias name self contains the prefix

## 1.7.0 (2022-02-07)
- possible BREAKING CHANGE (low probability): limiting for the method `compile` by resolving a variable in the argument of require() used in pug, see [resolve resources](https://github.com/webdiscus/pug-loader#resolve_resources) .\
  The methods `render` and `html` are not affected.
- change the evaluation to interpolation of required files for `compile` method to fix issue `undefined variable`
- fix issue `undefined variable` for method `compile` by use the variables in pug w/o optional chaining
- added tests for the `compile` and `render` methods
- update packages

## 1.6.4 (2022-01-31)
- added supports the `htmlWebpackPlugin.options` in pug template, #8
- added test case for require fonts in pug template
- refactoring of tests

## 1.6.3 (2022-01-25)
- improve error message due to template function failure
- refactor exceptions
- update readme

## 1.6.2 (2022-01-21)
- fix the path of dependencies in windows
- update npm packages

## 1.6.1 (2022-01-20)
- added supports for resolving of aliases from webpack `resolve.plugins` by required resources, like styles, scripts
- added supports for resolving of `srcset` attribute in `img` tag
- improve resolving the required files by all methods
- fix resolving issues by usage the variable filename contained parent relative path in require() function
- refactoring
- added more test cases

## 1.6.0 (2022-01-12)
- added supports for resolving of aliases from webpack `resolve.plugins` by include / extends
  if a file is by webpack `resolve.alais` not resolved, then uses the slow enhanced resolver
- update packages

## 1.5.1 (2021-12-10)
- fix path resolving on Windows
- some optimisations
- code refactoring

## 1.5.0 (2021-12-07)
- NEW: the `pug-loader` is now the part of the [pug-plugin](https://github.com/webdiscus/pug-plugin).
- added the option `basedir` for all absolute inclusion
- added the test for new option `basedir`
- refactoring of tests

## 1.4.6 (2021-12-06)
- remove needles console.log, cleanup code 
- added tests for an exception and an option
- refactoring test utils
- update readme
- update packages

## 1.4.5 (2021-11-22)
- improve the `render` and `html` methods
- fix require() for CommonJS module. Now is possible use the CommonJS module directly in the pug, e.g.:
  ```pug
  - var someModule = require('some-module');
  p #{ someModule.sayHello('PUG') }
  ```
- fix 'Unexpected token' by render method
- fix 'Unterminated string' by render method

## 1.4.4 (2021-11-19)
- added the polyfill `replaceAll()` for node.js < 15
- fix for the parsing multiple `require` in a single string code

## 1.4.3 (2021-11-18)
- minor code update and cleanup

## 1.4.2 (2021-11-18)
- added supports for require of JS and JSON data files in pug at compile time, e.g.:
  ```pug
  - var someData = require('some-data.json');
  each item in someData
    p= item.anyProperty
  ```
- fix issues by samples

## 1.4.1 (2021-11-17)
- improvement: inner optimizations for the `render` method
- code cleanup

## 1.4.0 (2021-11-16)
- added the option `esModule` to enable/disable ES modules syntax in generated JS modules
- improvement: some code improvements

## 1.3.1 (2021-11-15)
- update package version for samples

## 1.3.0 (2021-11-15)
- the `render` method has been improved. Now the method render a pug into HTML really at compile time without limitations for resolving an embedded resource.
  This method do same result as any other pug-loader + html-loader, even faster, generate smaller code and with all that not need an additional loader.
- refactoring

## 1.2.0 (2021-11-12)
- added the new loader method `html` to render the template function into pure HTML string,\
  this method require additional loader, e.g. `html-loader`
- added directory with samples for usage this loader with Angular Component

## 1.1.1 (2021-11-10)
- fix config for tests
- cleanup tests

## 1.1.0 (2021-11-10)
- added supports for usage of `compile` or `render` methods in JavaScript:  
  - added loader option `method: render|compile` to render into HTML or compile into a template function all templates required in js file
  - in the js require() can be used the query parameter `?pug-render` to render the pug template directly into HTML, independent of loader option `method`, \
    e.g. `const html = require('template.pug?pug-render')`
  - in the js require() query can be used the query parameter `?pug-compile`to compile the pug template into a template function, independent of loader option `method`, \
    e.g. `const tmpl = require('template.pug?pug-compile')`
- added the passing a custom data into a template at compile time: 
  - added loader option `data: {}` to pass a data into all templates at compile time, e.g. useful for the i18n data
  - in the js require () query you can use URL `key=value` or JSON `{key:value}` parameters to pass them into the template at compile time, \
    e.g. `const tmpl = require('template.pug?key1=value1&{"key2":"value2","key3":"value3"}')`
- update dependencies in package.json

## 1.0.3 (2021-10-21)
- added missed dependency for test
- update dependencies for test
- update readme

## 1.0.2 (2021-10-20)
- added the test case to cover the `pugjs/pug-loader` [issue](https://github.com/pugjs/pug-loader/issues/123) : `Module not found: Error: Can't resolve` when use a mixin and require on same file.\

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
