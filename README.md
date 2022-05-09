<div align="center">
    <h1>
        <a href="https://pugjs.org">
            <img height="135" src="https://cdn.rawgit.com/pugjs/pug-logo/eec436cee8fd9d1726d7839cbe99d1f694692c0c/SVG/pug-final-logo-_-colour-128.svg">
        </a>
        <a href="https://github.com/webpack/webpack">
            <img height="120" src="https://webpack.js.org/assets/icon-square-big.svg">
        </a>
        <a href="https://github.com/webdiscus/pug-loader"><br>
        Pug Loader
        </a>
    </h1>
  <div>Webpack loader to render pug templates</div>
</div>

---
[![npm](https://img.shields.io/npm/v/@webdiscus/pug-loader?logo=npm&color=brightgreen "npm package")](https://www.npmjs.com/package/@webdiscus/pug-loader "download npm package")
[![node](https://img.shields.io/node/v/@webdiscus/pug-loader)](https://nodejs.org)
[![node](https://img.shields.io/github/package-json/dependency-version/webdiscus/pug-loader/peer/webpack)](https://webpack.js.org/)
[![node](https://img.shields.io/github/package-json/dependency-version/webdiscus/pug-loader/peer/pug)](https://github.com/pugjs/pug)
[![codecov](https://codecov.io/gh/webdiscus/pug-loader/branch/master/graph/badge.svg?token=457T2BK3YN)](https://codecov.io/gh/webdiscus/pug-loader)
[![node](https://img.shields.io/npm/dm/@webdiscus/pug-loader)](https://www.npmjs.com/package/@webdiscus/pug-loader)

This [pug-loader](https://www.npmjs.com/package/@webdiscus/pug-loader) render pug templates into HTML to save it in a
file or compile pug to template function for usage the pug directly in JavaScript.
The pug loader can resolve paths and webpack aliases for `extends` `include` `require()`.

> ⚠️ **HIGHLY RECOMMENDED** to use the [pug-plugin](https://github.com/webdiscus/pug-plugin).\
> _Pug plugin makes your life a lot easier._
> _Keep your webpack config clean and clear._
> 
> This `pug-loader` is already included in the [pug-plugin](https://github.com/webdiscus/pug-plugin).\
> The `pug-plugin` enable using Pug templates as webpack entry points.\
> The `pug-plugin` resolve and compile source files of scripts and styles included directly in Pug, without to define them in the webpack entry. 
> You don't need more additional plugins such as `html-webpack-plugin` and `mini-css-extract-plugin`. 
> Pug plugin does everything by itself and much faster.
> 
> Please see [usage examples](https://github.com/webdiscus/pug-plugin#usage-examples) and the demo app [Hello World](https://github.com/webdiscus/pug-plugin/tree/master/examples/hello-world).

## Contents

1. [Install and Quick start](#install-and-quick-start)
1. [Options](#options)
1. [Embedded filters](#embed-filters)
1. [Usage method `compile`](#method-compile)
1. [Usage method `render`](#method-render)
1. [Usage method `html`](#method-html)
1. [Passing data into pug template](#passing-data-into-template)
1. [Usage embedded resources](#usage-embedded-resources)
1. [Usage with Angular Component](#usage-with-angular-component)
1. [Recipes](#recipes)
1. [Example "Hello World!"](https://github.com/webdiscus/pug-loader/tree/master/examples/webpack-app-hello-pug/)
1. [More examples](https://github.com/webdiscus/pug-loader/tree/master/test/cases)

<a id="features" name="features" href="#features"></a>
## Features

- rendereing pug into pure `HTML string` to save it in separate file
- compiling pug into `template function` for usage in JavaScript
- generates a template function with both `CommonJS` and `ESM` syntax
- resolves alias from webpack `resolve.alias`
- resolves alias from `compilerOptions.paths` defined in `tsconfig.json`
  using [`tsconfig-paths-webpack-plugin`](https://github.com/dividab/tsconfig-paths-webpack-plugin)
- resolves required images in the attribute `srcset` of `img` tag
- has embedded filters, e.g `:escape`
- resolves required JavaScript modules or JSON in pug
- ignore the prefixes `~` `@` for webpack `resolve.alias`
- passing custom data into pug template
- watching of changes in all dependencies
- integration with `Angular Component`
- supports for features and options of original [`pugjs/pug-loader`](https://github.com/pugjs/pug-loader/)
- many time faster than original `pugjs/pug-loader`

<a id="install-and-quick-start" name="install-and-quick-start" href="#install-and-quick-start"></a>

## Install and Quick start

To extract HTML from a pug template and save it to a file, use the [pug-plugin](https://github.com/webdiscus/pug-plugin)
or [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin).

### Using [`pug-plugin`](https://github.com/webdiscus/pug-plugin)

Install the `pug-plugin` if you want extract HTML from pug defined in webpack entry.

```console
npm install pug-plugin --save-dev
```

> Note: the `pug-plugin` already contain the `pug-loader`, not need to install extra any `pug-loader`.

Change your **webpack.config.js** according to the following minimal configuration:

```js
const path = require('path');
const PugPlugin = require('pug-plugin');

module.exports = {
  output: {
    path: path.join(__dirname, 'public/'),
    publicPath: '/', // must be defined any path, `auto` is not supported yet
  },
  entry: {
    index: './src/index.pug', // the `pug-plugin` extract HTML from entry file
  },
  plugins: [
    new PugPlugin(), // add it to handle pug files in entry
  ],
  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: PugPlugin.loader, // the pug-plugin already contain this pug-loader
        options: {
          method: 'render', // the fastest method to generate HTML files
        }
      },
    ],
  },
};
```

### Using [`html-webpack-plugin`](https://github.com/jantimon/html-webpack-plugin)

Install the `pug-loader` only if you use the `html-webpack-plugin`.

```console
npm install @webdiscus/pug-loader --save-dev
```

Change your **webpack.config.js** according to the following minimal configuration:

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  output: {
    path: path.join(__dirname, 'public/'),
    publicPath: '/', // must be defined any path, `auto` is not supported yet
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/index.pug'),
      filename: 'index.html',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: '@webdiscus/pug-loader',
      },
    ],
  },
};
```

### Usage in JavaScript

Install the `pug-loader`.

```console
npm install @webdiscus/pug-loader --save-dev
```

Change your **webpack.config.js** according to the following minimal configuration:

```js
const path = require('path');

module.exports = {
  output: {
    path: path.join(__dirname, 'public/'),
    publicPath: '/', // must be defined any path, `auto` is not supported yet
  },
  entry: {
    index: './src/index.js', // load a pug file in JS
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: '@webdiscus/pug-loader',
      },
    ],
  },
};
```

Load a pug template in JavaScript. Optional you can pass any data into generated template function.

**./src/index.js**

```js
const tmpl = require('template.pug');
const html = tmpl({
  myVar: 'value',
});
```

<a id="options" name="options" href="#options"></a>

## Original options

[See original description of options](https://pugjs.org/api/reference.html#options)

### `basedir`

Type: `string` Default: `/`<br>
The root directory of all absolute inclusion.

### `doctype`

Type: `string` Default: `html`<br>
Specifies the type of document. [See available doctypes](https://pugjs.org/language/doctype.html#doctype-option).

### `self`

Type: `boolean` Default: `false`<br>
Use the `self` as namespace for the local variables in template. It will speed up the compilation, but for access to variable, e.g. `myVariable`, you must write `self.myVariable`.

### `globals`

Type: `Array<string>` Default: `[]`<br>
Add a list of global names to make accessible in templates.

### `filters`

Type: `object` Default: `undefined`<br>
Hash table of [custom filters](https://pugjs.org/language/filters.html#custom-filters).
Filters let to use other languages in Pug templates.

### `plugins`

Type: `Array<Object>` Default: `[]`<br>
Plugins allow to manipulate pug tags, template content in compile process.
How it works [see in source of pug](https://github.com/pugjs/pug/blob/master/packages/pug/lib/index.js).

### `compileDebug`

Type: `boolean` Default: `false`<br>
Includes the function source in the compiled template to improve error reporting.

### `pretty`

Type: `boolean` Default: `false`<br>
This option is **deprecated** by pugjs and always is `false`. Don't use it.

## Additional options

### `method`

Type: `string` Default: `compile`<br>
Values:
 - `compile` the pug template compiles into a template function and in JavaScript can be called with variables to render into HTML at runtime. \
   The query parameter is `?pug-compile`. Can be used if the method is `render`. \
   Use this method, if the template have variables passed from JavaScript at runtime. [see usage](#method-compile)
 - `render` the pug template renders into HTML at compile time and exported as a string. 
   All required resource will be processed by the webpack and separately included as added strings wrapped to a function. \
   The query parameter is `?pug-render`. Can be used if the method is `compile` or is not defined in options. \
   Use this method, if the template does not have variables passed from JavaScript at runtime. The method generates the most compact and fastest code. [see usage](#method-render)
 - `html` the template renders into a pure HTML string at compile time. The method need an addition loader to handles the HTML. \
   Use this method if the rendered HTML needs to be processed by additional loader, e.g. by `html-loader` [see usage](#method-html)
 
> Embedded resources such as `img(src=require('./image.jpeg'))` handles at compile time by the webpack using [**asset/resource**](https://webpack.js.org/guides/asset-modules/#resource-assets).

### `esModule`

Type: `Boolean` Default: `false`<br>
Enable / disable ESM syntax in generated JS modules. \
Values:
 - `true` The `pug-loader` generates JS modules with the ESM syntax. \
   For example: `import html from 'template.pug';`. \
   For smaller and faster JS code, it is recommended to use this mode.
 - `false` defaults. The `pug-loader` generates JS modules with the CommonJS modules syntax. \
   For example, `const html = require('template.pug')`. \
   The default value is `false` for compatibility with the JS modules that is generated by the original pug-loader.
 
> **Note:** The option `esModule` is irrelevant for the  `html` method, because it returns a pure HTML string.

💡 For generates smaller and faster template function, it is recommended to use following options:

```js
{
  method: 'render',
  esModule: true,
}
```

### `data`

Type: `Object` Default: `{}`<br>
The custom data will be passed in all pug templates, it can be useful by pass global data.

> ⚠️ Limitation by the `compile` method. \
> A string representing the source code of the function is limited by the `function.toString()`, see [examples](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/toString#examples). \
> For native work of the function passed via the `data` loader option, use the `render` method.

### `embedFilters`
Type: `Object` Default: `undefined`<br>
Enable embedded pug filters.
To enable a filter add to pug-loader options following:
```js
{
  embedFilters: {
    <FILTER_NAME> : <FILTER_OPTIONS> | <TRUE>,
  }
}
```
Where `<FILTER_NAME>` is the name of a embedded filter, the available filters see below.
The filter can have options `<FILTER_OPTIONS>` as an object.
If the filter has no options, use `true` as an option to enable the filter.


<a id="embed-filters" name="embed-filters" href="#embed-filters"></a>

## Embedded filters

> ⚠️ Defaults all embedded filters are disabled!\
> Enable only filters used in your pug templates.

> 💡 We have currently only one embedded filter, but other useful filters will occasionally be added. 
> 
> The goal of the embedded filters is use fast and lightweight filters without additional dependencies in package.json. 
> Here we want collect most useful small filters.
> It is like [custom filters](https://pugjs.org/language/filters.html#custom-filters), but already exists in the [filter collection](https://github.com/webdiscus/pug-loader/tree/master/src/filters), that can be simply via an option enabled.
> 
> In issues, you can suggest your own filter, and we can add it.

### `escape`
Pug filter: `:escape` Filter options: `none`\
The filter escapes HTML tags to display HTML code in the browser as plain text.
This is useful when using syntax highlighting for code containing HTML tags.


Enable the filter:

```js
{
  embedFilters: {
    escape: true,
  },
}
```

Using the `:escape` filter in pug:

```pug
pre: code.language-html
  :escape
    <!-- HTML -->
    <div>
      <p>Text</p>
    </div>
```

Generates plain text:

```
<pre>
  <code class="language-html">
    &lt;!-- HTML --&gt;
    &lt;div&gt;
      &lt;p&gt;Text&lt;/p&gt;
    &lt;/div&gt;
  </code>
</pre>
```

Display in browser:

```html
<!-- HTML -->
<div>
  <p>Text</p>
</div>
```

Inline syntax:
```
p
  :escape The <strong> element has the closing </strong> tag.

p.
  The #[:escape <html>] element is the root element.<br>
  Inside the #[:escape <html>] element there is a #[:escape <body>] element.
```

Generates plain text:
```
<p>
  The &lt;strong&gt; element has the closing &lt;/strong&gt; tag.
</p>
<p>
  The &lt;html&gt; element is the root element.
  <br>
  Inside the &lt;html&gt; element there is a &lt;body&gt; element.
</p>
```

<a id="method-compile" name="method-compile" href="#method-compile"></a>

## Usage method `compile` (default)

In JavaScript the required template will be compiled into template function.\
In webpack config add to `module.rules`:

```js
{
  test: /\.pug$/,
  loader: '@webdiscus/pug-loader',
  options: {
    method: 'compile' // default method `compile` can be omitted
  }
}
```
In JavaScript, the result of require() is a template function. Call the template function with some variables to render it to HTML.
```js
const tmpl = require('template.pug');
const html = tmpl({ key: 'value' }); // the HTML string
```

To render the pug direct into HTML, use the query parameter `?pug-render`.

```js
// compile into template function, because loader option 'method' defaults is 'compile'
const tmpl = require('template.pug');
const html = tmpl({ key: 'value' });

// render the pug file into HTML, using the parameter 'pug-render'
const html2 = require('template2.pug?pug-render');
```

> **Note:** if the query parameter `pug-render` is set, then will be used rendering for this template, independent of the loader option `method`.
> Variables passed in template with method `render` will be used at compile time.

<a id="method-render" name="method-render" href="#method-render"></a>

## Usage method `render`

This method will render the pug into HTML at compile time. \
In webpack config add to `module.rules`:

```js
{
  test: /\.pug$/,
  loader: '@webdiscus/pug-loader',
  options: {
    method: 'render'
  }
}
```

In JavaScript the result of require() is an HTML string.

```js
const html = require('template.pug'); // the HTML string
```

To generate a template function for passing the data in pug at realtime, use the query parameter `?pug-compile`.

```js
// render into HTML, because loader option 'method' is 'render'
const html = require('template.pug');

// compile into template function, using the parameter 'pug-compile'
const tmpl2 = require('template2.pug?pug-compile');
const html2 = tmpl2({ ... });
```

<a id="method-html" name="method-html" href="#method-html"></a>

## Usage method `html`

This method will render the pug to pure HTML and should be used with an additional loader to handle HTML. \
In webpack config add to `module.rules`:

```js
{
   test: /\.pug$/,
   use: [
     { 
       loader: 'html-loader',
       options: {
         esModule: false, // allow to use the require() for load a template in JavaScript
       },
     },
     {
       loader: '@webdiscus/pug-loader',
       options: {
         method: 'html',
       },
     },
   ],
}
```

In JavaScript the result of require() is an HTML string:

```js
const html = require('template.pug'); // the HTML string
```

<a id="passing-data-into-template" name="passing-data-into-template" href="#passing-data-into-template"></a>

## Passing data into template

### In JavaScript

By default, the pug file is compiled as template function, into which can be passed an object with template variables.

```js
const tmpl = require('template.pug');
const html = tmpl({
  myVar: 'value',
  foo: 'bar'
});
```

But how pass variables in template which is rendered into HTML?\
Variables can be passed with query parameters.

```js
const html = require('template.pug?myVar=value&foo=bar');
```

or as a JSON object:

```js
const html = require('template.pug?' + JSON.stringify({ myVar: 'value', foo: 'bar' }));
```

Use variables `myVar` and `foo` in pug template.

```pug
div The value of "myVar": #{myVar}
div The value of "foo": #{foo}
```

> Usage of query parameters is legal and [official documented](https://webpack.js.org/api/loaders/#thisresourcequery) feature of webpack loader.


### In webpack.config.js

Pass `myData` object via query.

```js
entry: {
  about: './src/pages/about.pug?myData=' + JSON.stringify({ title: 'About', options: { uuid: 'abc123' } })
}
```

Use the object `myData` in pug template.

```pug
html
head
  title= myData.title
body
  div UUID: #{myData.options.uuid}
```

To pass global data to all pug templates, add the loader options `data` as any object.

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: '@webdiscus/pug-loader',
        options: {
          data: {
            htmlLang: 'en-EN',
            getKeywords: () => {
              const keywords = ['webpack', 'pug', 'loader'];
              return keywords.join(',');
            }
          }
        }
      },
    ],
  },
};
```

Use the custom data and function in pug.

```pug
html(lang=htmlLang)
head
  meta(name="keywords" content=getKeywords())
body
```

### Passing data in HtmlWebpackPlugin

The user data can be passed into pug template with two ways:

- via HtmlWebpackPlugin options
- via query parameters of template file

```js
module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      title: 'The some page', // avaliable in pug as `htmlWebpackPlugin.options.title`
      template: path.join(__dirname, 'src/index.pug?' + JSON.stringify({ myVar: 'value' })), // avaliable as `myVar`
      filename: 'index.html',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: '@webdiscus/pug-loader',
      },
    ],
  },
};
```

Use the passed variables `htmlWebpackPlugin.options` and `myVar` in pug template:

```pug
html
  head
    title= htmlWebpackPlugin.options.title
  body
    div= myVar
```

### Load a static data in the pug

You can load data directly in pug.\
**data.json**

```json
[
  { "id": 1, "name": "abc" },
  { "id": 2, "name": "xyz" }
]
```

Require the JSON file in pug.

```pug
- var myData = require('./data.json')
each item in myData
  div #{item.id} #{item.name}
```

<a id="usage-embedded-resources" name="usage-embedded-resources" href="#usage-embedded-resources"></a>

## Usage embedded resources

To handle resources in pug with webpack use the `require()` function:

```pug
img(src=require('./path/to/image.jpeg'))
```

For images, add the following rule to the webpack module:

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg|svg|ico)/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name].[hash:8][ext]',
        },
      },
    ]
  },
};
```

For fonts, add the following rule to the webpack module:

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(woff2|woff|ttf|svg|eot)/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[name][ext]',
        },
      },
    ]
  },
};
```

More information about asset-modules [see here](https://webpack.js.org/guides/asset-modules/).

Example of dynamic interpolation of image src in pug:

```pug
- files = ['image1.jpeg', 'image2.jpeg', 'image3.jpeg']
each file in files
  img(src=require(`./path/to/${file})`)
```

<a id="resolve_resources" name="resolve_resources" href="#resolve_resources"></a>

### 💡 Resolve resources

The file in the current directory `MUST` start with `./`:

```pug
img(src=require('./image.jpeg'))
img(src=require('./sub/path/to/image.jpeg'))
```

The file in the parent directory `MUST` start with `../`:

```pug 
img(src=require('../images/image.jpeg'))
 ```

The relative path from loader option `basedir` `MUST` start with `/`:

```js
loader: '@webdiscus/pug-loader',
options: {
  basedir: path.resolve(__dirname, './src')
}
```

```pug
img(src=require('/assets/images/image.jpeg')) <-- relative path from the basedir
```
The file in the directory defined by `webpack aliase` `MAY` start with `~` or `@`, e.g. with the alias `Images: path.join(__dirname, 'src/assets/images/')`:
```pug
img(src=require('Images/image.jpeg'))
img(src=require('~Images/image.jpeg'))
img(src=require('@Images/image.jpeg'))
```

⚠️ Using a variable with the `compile` method has the limitation - the variable `MUST NOT` contain a path, only a filename, because is interpolated at compile time:
```pug
- const file = 'image.jpeg'
img(src=require('./path/to/' + file))  // sub directory
img(src=require('../path/to/' + file)) // parent directory
img(src=require('/path/to/' + file))   // option.base directory
img(src=require('~Images/' + file))    // webpack alias
```

but in current directory, the filename `MUST` start with `./`:

```pug
- const file = './image.jpeg'
img(src=require(file))
```

⚠️ Using an alias from the `paths` defined in `tsconfig.json` with the `compile` method has the limitation - the required argument `MUST` be a string only, the webpack not supports an expression with alias:\
**tsconfig.json**

```js 
{
  "compilerOptions": {
  "paths": {
     "@Images/*": ["assets/images/*"]
   }
  }
}
```

```pug
- const file = './image.jpeg'
img(src=require('@Images/image.jpeg')) // webpack alias resolved via `resolve.plugiins` from `tsconfig.json`
img(src=require('@Images/' + file))    // ERROR: Can't resolve '@Images' in require expression.
```

Using a variable with `render` and `html` methods has no limitation - the variable `MAY` contain a path, because is resolved at runtime:
```pug
- const file = '../parent/path/to/image.jpeg'
img(src=require(file))
img(src=require('~Images/' + file))
img(src=require('@Images/' + file))
```

### Examples of file resolving

The example of webpack alias used in the table below:
```
resolve: {
  alias: {
    Images: path.join(__dirname, 'src/assets/images/'),
  },
}
```

| Example in pug template                                                                                                                                | @webdiscus/<br>pug-loader<br>`render` / `html` methods | @webdiscus/<br>pug-loader<br>`compile` method | pugjs/<br>pug-loader  |
|--------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------|----------------------------------------------|-----------------------|
| `img(src=require('logo.png'))`                                                                                                                         | ✅ but not recomended                                   | ❌                                            | ❌                     |
| `img(src=require('./logo.png'))`                                                                                                                     | ✅                                                      | ✅                                            | ✅                     |
| `img(src=require('../images/logo.png'))`                                                                                                             | ✅                                                      | ✅                                            | ✅                     |
| `img(src=require('~Images/logo.png'))`                                                                                                               | ✅                                                      | ✅                                            | ✅                     |
| `- var file = 'logo.png'`<br>``img(src=require(`~Images/${file}`))``                                                                                 | ✅                                                      | ✅                                            | ✅                     |
| `- var file = './logo.png'`<br>`img(src=require(file))`                                                                                              | ✅                                                      | ✅                                            | ❌                     |
| `- var file = './images/logo.png'`<br>`img(src=require(file))`                                                                                       | ✅                                                      | ✅                                              | ❌                     |
| `- var file = '../images/logo.png'`<br>`img(src=require(file))`                                                                                      | ✅                                                      | ❌                                            | ❌                     |
| `- var file = 'logo.png'`<br>``img(src=require(`./images/${file}`))``                                                                                | ✅                                                      | ✅                                            | ✅                     |
| `- var file = 'logo.png'`<br>`img(src=require('../images/' + file))`                                                                                 | ✅                                                      | ✅                                            | ✅                     |
| `pugjs/pug-loader` can't resolve a resource<br>when used a mixin and require in same file: <br> `include mixins`<br>`img(src=require('./logo.png'))` | ✅                                                      | ✅                                            | ❌                     |

<a id="usage-with-angular-component" name="usage-with-angular-component" href="#usage-with-angular-component"></a>
## Usage with Angular Component

Install

```
npm i --saveDev @webdiscus/pug-loader pug-plugin-ng
```
> in pug-loader can be used optional a plugin, e.g. [**pug-plugin-ng**](https://www.npmjs.com/package/pug-plugin-ng), to allow unquoted syntax of Angular: [(bananabox)]="val"

Create the file `webpack.config.js` in root directory of angular project:

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: '@webdiscus/pug-loader',
        options: {
          method: 'render',
          doctype: 'html',
          plugins: [require('pug-plugin-ng')],
        },
      },
    ],
  },
};
```

Bind the file `webpack.config.js` in the Angular config `angular.json`:
```js
{
  // ...
  "projects": {
      // ...
      "architect": {
        "build": {
          // replace architect.build.builder with this value:
          "builder": "@angular-builders/custom-webpack:browser",
          // add the options:
          "options": {
            "aot": true,
            "customWebpackConfig": {
              "path": "./webpack.config.js" // the path to webpack.config.js
            },
            // ...
          },
          // ...
        },
        "serve": {
          // replace architect.serve.builder with this value:
          "builder": "@angular-builders/custom-webpack:dev-server",
          "options": {
            "browserTarget": "<app-name>:build"
          },
          // ...
        },
        // ...
      }
    }
  },
}
```

In a component file, e.g. `./src/app/app.component.ts` set the `templateUrl` with pug file:
```js
import { Component } from '@angular/core';

// the variable `description` will be passed into pug template via resource query
const templateVars = '{"description": "Use pug template with Angular."}';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.css'],
  templateUrl: './app.component.pug?' + templateVars,
})
export class AppComponent {
  title = 'ng-app';
}
```

Create a pug template, e.g. `./src/app/app.component.pug`:

```pug
h1 Hello Pug!
p Description: #{description}
```

See [the complete source of the example](https://github.com/webdiscus/pug-loader/tree/master/examples/angular-component-render/).


<a id="recipes" name="recipes" href="#recipes"></a>
## Recipes

### Resolving the attribute `srcset` in `img` tag
```pug
img(srcset=`${require('./image1.jpeg')} 320w, ${require('./image2.jpeg')} 640w` src=require('./image.jpeg'))
```

output
```html
<img srcset="/assets/image1.f78b30f4.jpeg 320w, /assets/image2.f78b30f4.jpeg 640w" src="/assets/image.f78b30f4.jpeg">
```

### Usage a JavaScript module in pug

Use the `require()` for CommonJS files in pug templates. \
The JS module **say-hello.js**

```js
module.exports = function(name) {
  return `Hello ${name}!`;
}
```

Use the module `sayHello` in pug template.

```pug
- var sayHello = require('./say-hello')
h1 #{sayHello('pug')}
```

## Testing

`npm run test` will run the unit and integration tests.\
`npm run test:coverage` will run the tests with coverage.

## Also See

- more examples of usages see in [test cases](https://github.com/webdiscus/pug-loader/tree/master/test/cases)
- [`ansis`][ansis] - ANSI color styling of text in terminal
- [`pug GitHub`][pug]
- [`pug API Reference`][pug-api]
- [`pug-plugin`][pug-plugin]

## License

[ISC](https://github.com/webdiscus/pug-loader/blob/master/LICENSE)

[ansis]: https://github.com/webdiscus/ansis
[pug]: https://github.com/pugjs/pug
[pug-api]: https://pugjs.org/api/reference.html
[pug-plugin]: https://github.com/webdiscus/pug-plugin
