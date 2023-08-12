# Change log

## 2.10.5 (2023-08-12)
- fix: add the svg file referenced with a fragment, e.g. `icons.svg#home`, to watch dependencies
- chore: update packages

## 2.10.4 (2023-03-10)
- fix(for pug-plugin): add missing node modules to compilation after rebuild

## 2.10.3 (2023-03-04)
- fix: correct loader export when template contain CRLF line separators

## 2.10.2 (2023-01-15)
- fix(for pug-plugin): resolving of inline JS source file

## 2.10.1 (2023-01-15)
- feat(for pug-plugin): add supports for inline JS
- refactor: code optimizations

## 2.10.0 (2023-01-03)
- feat: resolve required resources in attribute blocks:
  ```pug
  img&attributes({
    src: require('./image.png'),
    srcset: `${require('./image1.png')} 80w, ${require('./image2.png')} 90w`,
  })
  ```
  - chore: update packages

## 2.9.7 (2022-12-25)
- fix(for pug-plugin): set correct asset name of script for multi-lang pages

## 2.9.6 (2022-12-25)
- fix(for pug-plugin): store unique script and set actual asset name of script by HMR

## 2.9.5 (2022-12-22)
- fix: passing `data` option when the `self` options is true in compile method 
- refactor: optimize code
- chore: update development packages
- test: add tests for data and self options

## 2.9.4 (2022-10-11)
- fix: resolving of assets in pug templates with url query
- chore: update packages

## 2.9.3 (2022-09-17)
- chore: add peerDependenciesMeta to package.json for optional modules

## 2.9.2 (2022-09-10)
- fix: resolve modules whose package.json contains `exports` field
- fix: added minimal required version of `enhanced-resolve` in `peerDependencies` to avoid using incompatible version by other modules
- chore: update packages

## 2.9.1 (2022-09-08)
- fix: fixed last stable version of ansis in package.json to avoid issues in dependency

## 2.9.0 (2022-08-27)
- feat: add resolving for require in conditional, e.g.:
  ```pug
  if condition
    img(src=require('./image1.png'))
  else
    img(src=require('./image2.png'))
  ```
- feat: add resolving for require in mixin argument, e.g. `+image(require('./logo.png'), 'logo')`
- feat: add resolving for require in `each in` and in `each of` iteration object, e.g. `each [key, img] of new Map([['apple', require('./apple.png')], ['sony', require('./sony.png')]])`
- refactor: replace pug-walk lib with optimized up to x2.5 faster implementation without recursion
- test(BREAKING): drop support for Node v12, because lastest `jest` v29 supports Node.js >= 14.15.0.

## 2.8.2 (2022-08-21)
- chore: optimize script store for pug-plugin

## 2.8.1 (2022-08-12)
- feat: add supports for a string value by the `watchFiles` option
- fix: resolve style in Pug from node_modules by module name, e.g.: `link(href=require('bootstrap') rel='stylesheet')`
- chore: inner optimisations for using with the pug-plugin

## 2.8.0 (2022-08-03)
- feat: add resolving of file alias for scripts and styles
- feat: improve resolving of script files specified w/o extension
- feat: improve performance
- fix: allow to use url query in script source file
- fix: resolving of absolute path using root context
- fix: resolving of alias to file using root context
- chore: optimize for using with pug-plugin
- chore: using html-webpack-plugin with Pug is deprecated, use [pug-plugin](https://github.com/webdiscus/pug-plugin)) instead
- refactor: optimize code
- tests: add test cases and optimize test fixtures

## 2.7.2 (2022-07-03)
- fix: HMR issue on Windows

## 2.7.1 (2022-07-03)
- fix: remove unused module

## 2.7.0 (2022-07-03)
- feat: display the error message on broken page due to fatal error
- feat: add HMR support on broken page due to fatal error

## 2.6.6 (2022-06-22)
- fix: issue by resolving Pug aliases on Windows

## 2.6.5 (2022-06-20)
- fix: warning by watching interpolated dependencies with `compile` method
- refactor: replace polyfill for replaceAll() with regexp replace()

## 2.6.4 (2022-06-10)
- fix: add supports for webpack resolve modules

## 2.6.3 (2022-06-09)
- fix: parse require() value with complex interpolation

## 2.6.2 (2022-06-08)
- fix: encode reserved chars for resource query

## 2.6.1 (2022-06-06)
- fix: add support the prefixes `~` `@` for file alias

## 2.6.0 (2022-06-04)
- feat: add support the resolving a file alias in `include`

## 2.5.0 (2022-06-02)
- feat: add `watchFiles` option to watch for file changes in resolved dependencies
- fix: in `:markdown` filter enable HTML tags in markdown source

## 2.4.1 (2022-05-25)
- docs: update readme

## 2.4.0 (2022-05-25)
- feat: add support the Pug in Vue
- feat: add support an indent in Vue template for Pug code
- chore: add usage example for Pug in Vue template
- test: add test for remove unexpected indents in Vue template

## 2.3.0 (2022-05-21)
- feat: add embedded filter `:markdown` with highlighting code blocks

## 2.2.1 (2022-05-19)
- fix: pug error in dependency requires restart of webpack, [#14](https://github.com/webdiscus/pug-loader/issues/14)

## 2.2.0 (2022-05-15)
- feat: add embedded filters `:code`, `:highlight`
- fix: add `&` and `"` chars in `:escape` filter

## 2.1.1 (2022-05-11)
- fix: support resolving npm modules in pug template

## 2.1.0 (2022-05-09)
- feat: add the `embedFilter` option to enable using in pug filters embedded in pug-loader
- feat: add embedded `:escape` filter to escape HTML tags
- test: add test for `:escape` filter

## 2.0.0 (2022-04-01)
- feat: added supports the require() of the javascript source files directly in pug (works only
  with [pug-plugin](https://github.com/webdiscus/pug-plugin)). \
  It is no longer necessary to define a js file in webpack entry-point.
  For example, using the `pug-plugin` now following is possible:
  ```pug
  script(src=require('./main.js'))
  ```
  Generated HTML:
  ```html
  <script src='/assets/js/main.1234abcd.js'></script>
  ```
- feat: add support a function in loader option `data` for `compile` method.

## 1.8.0 (2022-03-05)
- feat: resolve the variable contained a subdirectory in the relative path
  ```pug
  - var file = './subdir/image.jpg';
  img(src=require(file))
  ```
- feat: resolve a required path in the variable
  ```pug
  - var file = require('./subdir/image.jpg');
  img(src=file)
  ```
- feat: watching of required `js` and `json` files in pug

## 1.7.4 (2022-02-20)
- chore: code refactoring and internal optimization
- docs: update readme

## 1.7.3 (2022-02-19)
- fix: collision with local variables passed in template function for compile method

## 1.7.2 (2022-02-19)
- fix: path error in Windows when watching dependencies
- chore: update packages

## 1.7.1 (2022-02-10)
- feat: add supports for webpack alias as array of paths, [#10](https://github.com/webdiscus/pug-loader/issues/10)
- fix: optional prefix of alias in request when an alias name self contains the prefix

## 1.7.0 (2022-02-07)
- BREAKING CHANGE (low probability): limiting for the method `compile` by resolving a variable in the argument
  of require() used in pug, see [resolve resources](https://github.com/webdiscus/pug-loader#resolve_resources) .\
  The methods `render` and `html` are not affected.
- fix: change the evaluation to interpolation of required files for `compile` method to fix issue `undefined variable`
- fix: issue `undefined variable` for method `compile` by use the variables in pug w/o optional chaining
- test: add tests for the `compile` and `render` methods
- chore: update packages

## 1.6.4 (2022-01-31)
- feat: add supports the `htmlWebpackPlugin.options` in pug template, #8
- test: add test case for require fonts in pug template
- refactor: tests

## 1.6.3 (2022-01-25)
- feat: improve error message due to template function failure
- refactor: exceptions
- docs: update readme

## 1.6.2 (2022-01-21)
- fix: the path of dependencies in windows
- chore: update npm packages

## 1.6.1 (2022-01-20)
- feat: add supports for resolving of aliases from webpack `resolve.plugins` by required resources, like styles, scripts
- feat: add supports for resolving of `srcset` attribute in `img` tag
- fix: improve resolving the required files by all methods
- fix: resolving issues by usage the variable filename contained parent relative path in require() function
- refactor: optimize source
- test: add test cases to improve test coverage

## 1.6.0 (2022-01-12)
- feat: add supports for resolving of aliases from webpack `resolve.plugins` by include / extends
  if a file is by webpack `resolve.alais` not resolved, then uses the slow enhanced resolver
- chore: update packages

## 1.5.1 (2021-12-10)
- fix: path resolving on Windows
- refactor: optimize code

## 1.5.0 (2021-12-07)
- feat: the `pug-loader` is now the part of the [pug-plugin](https://github.com/webdiscus/pug-plugin).
- feat: add the option `basedir` for all absolute inclusion
- test: add the test for new option `basedir`
- test: refactor tests

## 1.4.6 (2021-12-06)
- test: add tests for an exception and an option
- test: refactor test utils
- docs: update readme
- chore: remove needles console.log, cleanup code
- chore: update packages

## 1.4.5 (2021-11-22)
- feat: improve the `render` and `html` methods
- fix: require() for CommonJS module. Now is possible use the CommonJS module directly in the pug, e.g.:
  ```pug
  - var someModule = require('some-module');
  p #{ someModule.sayHello('PUG') }
  ```
- fix: 'Unexpected token' by render method
- fix: 'Unterminated string' by render method

## 1.4.4 (2021-11-19)
- feat: add the polyfill `replaceAll()` for node.js < 15
- fix: the parsing multiple `require` in a single string code

## 1.4.3 (2021-11-18)
- refactor: cleanup code

## 1.4.2 (2021-11-18)
- feat: add supports for require of JS and JSON data files in pug at compile time, e.g.:
  ```pug
  - var someData = require('some-data.json');
  each item in someData
    p= item.anyProperty
  ```
- fix: issues by samples

## 1.4.1 (2021-11-17)
- refactor: inner optimizations for the `render` method

## 1.4.0 (2021-11-16)
- feat: add the option `esModule` to enable/disable ES modules syntax in generated JS modules
- refactor: code improvements

## 1.3.1 (2021-11-15)
- chore: update packages for examples

## 1.3.0 (2021-11-15)
- feat: the `render` method has been improved. Now the method render a pug into HTML really at compile time without
  limitations for resolving an embedded resource.
  This method do same result as any other pug-loader + html-loader, even faster, generate smaller code and with all that
  not need an additional loader.
- refactor: improve code

## 1.2.0 (2021-11-12)
- feat: add the new loader method `html` to render the template function into pure HTML string,\
  this method require additional loader, e.g. `html-loader`
- chore: add directory with samples for usage this loader with Angular Component

## 1.1.1 (2021-11-10)
- fix: config for tests
- chore: cleanup tests

## 1.1.0 (2021-11-10)
- feat: added supports for usage of `compile` or `render` methods in JavaScript:
    - added loader option `method: render|compile` to render into HTML or compile into a template function all templates
      required in js file
    - in the js require() can be used the query parameter `?pug-render` to render the pug template directly into HTML,
      independent of loader option `method`, \
      e.g. `const html = require('template.pug?pug-render')`
    - in the js require() query can be used the query parameter `?pug-compile`to compile the pug template into a
      template function, independent of loader option `method`, \
      e.g. `const tmpl = require('template.pug?pug-compile')`
- feat: added the passing a custom data into a template at compile time:
    - added loader option `data: {}` to pass a data into all templates at compile time, e.g. useful for the i18n data
    - in the js require () query you can use URL `key=value` or JSON `{key:value}` parameters to pass them into the
      template at compile time, \
      e.g. `const tmpl = require('template.pug?key1=value1&{"key2":"value2","key3":"value3"}')`
- chore: update dependencies in package.json

## 1.0.3 (2021-10-21)
- fix: add missed dependency for test
- chore: update dependencies for test
- docs: update readme

## 1.0.2 (2021-10-20)
- test: add the test case to cover
  the `pugjs/pug-loader` [issue](https://github.com/pugjs/pug-loader/issues/123) : `Module not found: Error: Can't resolve`
  when use a mixin and require on same file.\

## 1.0.1 (2021-10-20)
- chore: update packages
- docs: update readme
- refactor: cleanup code

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
