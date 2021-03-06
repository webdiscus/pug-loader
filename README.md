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
  <div>Webpack loader to render Pug templates</div>
</div>

---
[![npm](https://img.shields.io/npm/v/@webdiscus/pug-loader?logo=npm&color=brightgreen "npm package")](https://www.npmjs.com/package/@webdiscus/pug-loader "download npm package")
[![node](https://img.shields.io/node/v/@webdiscus/pug-loader)](https://nodejs.org)
[![node](https://img.shields.io/github/package-json/dependency-version/webdiscus/pug-loader/peer/webpack)](https://webpack.js.org/)
[![node](https://img.shields.io/github/package-json/dependency-version/webdiscus/pug-loader/peer/pug)](https://github.com/pugjs/pug)
[![codecov](https://codecov.io/gh/webdiscus/pug-loader/branch/master/graph/badge.svg?token=457T2BK3YN)](https://codecov.io/gh/webdiscus/pug-loader)
[![node](https://img.shields.io/npm/dm/@webdiscus/pug-loader)](https://www.npmjs.com/package/@webdiscus/pug-loader)

Pug loader renders Pug files into HTML or compiles them into a template function.
This Pug loader resolves paths and aliases for `extends` `include` `require()`.

> 💡**Pug loader** supports an **indent** in Vue template.
>
> _MyComponent.vue_
> ```html
> <template lang='pug'>
>   h1 Hello Pug!
>   p Use the '@webdiscus/pug-loader'
> </template>
> ```
> See [how to use Pug with Vue](#usage-with-vue) and [source of example](https://github.com/webdiscus/pug-loader/tree/master/examples/hello-world-vue).

<br>

> 💡 **Recommended** to use the [pug-plugin](https://github.com/webdiscus/pug-plugin).\
> The Pug plugin enable to specify Pug files in webpack entry and generates HTML file that includes the hashed output JS and CSS filenames whose source files are used in the Pug template.
>
> Highlights:
>
> - The Pug file is the entry point for all scripts and styles.
> - Source scripts and styles should be specified directly in Pug.
> - All JS and CSS files will be extracted from their sources specified in Pug.
> - No longer need to define scripts and styles in the webpack entry.
> - No longer need to import styles in JavaScript to inject them into HTML via additional plugins such as `html-webpack-plugin` and `mini-css-extract-plugin`.
>
> Please see [usage examples](https://github.com/webdiscus/pug-plugin#usage-examples) and the demo app [Hello World](https://github.com/webdiscus/pug-plugin/tree/master/examples/hello-world).

## Contents

1. [Install and Quick start](#install-and-quick-start)
2. [Options](#options)
3. [Usage of methods](#method-compile)
   - [compile](#method-compile)
   - [render](#method-render)
   - [html](#method-html)
4. [Usage of Pug filters](#embed-filters)
   - [:escape](#filter-escape)
   - [:code](#filter-code)
   - [:highlight](#filter-highlight)
   - [:markdown](#filter-markdown)
5. [Passing data into Pug template](#passing-data-into-template)
6. [Usage of embedded resources](#usage-embedded-resources)
7. [Usage with Angular](#usage-with-angular)
7. [Usage with Vue](#usage-with-vue)
8. [Recipes](#recipes)
9. [Example Hello World!](https://github.com/webdiscus/pug-loader/tree/master/examples/hello-world-app/)
10. [Example Pug filters](https://github.com/webdiscus/pug-loader/tree/master/examples/pug-filters)
11. [More examples](https://github.com/webdiscus/pug-loader/tree/master/test/cases)

<a id="features" name="features" href="#features"></a>
## Features

- rendering Pug into pure `HTML string`
- compiling Pug into `template function` for usage in JavaScript
- generates a template function with both `CommonJS` and `ESM` syntax
- resolves alias from webpack `resolve.alias`
- resolves alias from `tsconfig.json` `compilerOptions.paths`,
  requires [tsconfig-paths-webpack-plugin](https://github.com/dividab/tsconfig-paths-webpack-plugin)
- resolves required images in the attribute `srcset` of `img` tag
- resolves required JavaScript modules or JSON in pug
- integrated [Pug filters]: [`:escape`] [`:code`] [`:highlight`] [`:markdown`] with highlighting of code blocks
- passing custom data into Pug template
- watching of changes in all dependencies

---

<a id="install-and-quick-start" name="install-and-quick-start" href="#install-and-quick-start"></a>
## Install and Quick start

**Choose your way:**
- compile Pug files defined in webpack entry using the [`pug-plugin`](https://github.com/webdiscus/pug-plugin).
  It is a very easy intuitive way.
- compile Pug files defined in the [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin) using a pug-loader.
  It is non-intuitive and very complex way. Not recommended.

### Usage of [`pug-plugin`](https://github.com/webdiscus/pug-plugin)
For details and examples please see the [pug-plugin](https://github.com/webdiscus/pug-plugin) site.

Install the `pug-plugin`:

```
npm install pug-plugin --save-dev
```

**Note:** the `pug-plugin` already contains the [pug-loader](https://github.com/webdiscus/pug-loader), not need to install an additional Pug loader.

> ⚠️ **ATTENTION**
>
> The pug-plugin enable to use script and style source files directly in Pug, so easy:
> ```pug
> link(href=require('./styles.scss') rel='stylesheet')
> script(src=require('./main.js'))
> ```
> Generated HTML contains hashed CSS and JS output filenames:
> ```html
> <link href="/assets/css/styles.05e4dd86.css" rel="stylesheet">
> <script src="/assets/js/main.f4b855d8.js"></script>
> ```
>
> - Don't define styles and JS files in entry. You can use `require()` for source files of JS and SCSS in Pug.
> - Don't import styles in JS. Use `require()` for style files in Pug.
> - Don't use `html-webpack-plugin` to render Pug files in HTML. The Pug plugin processes files from webpack entry.
> - Don't use `mini-css-extract-plugin` to extract CSS from styles. The Pug plugin extract CSS from styles required in Pug.

Change your **webpack.config.js** according to the following minimal configuration:

```js
const path = require('path');
const PugPlugin = require('pug-plugin');

module.exports = {
  output: {
    path: path.join(__dirname, 'dist/'),
    publicPath: '/', // must be defined any path, `auto` is not supported
    // output filename of JS files
    filename: 'assets/js/[name].[contenthash:8].js'
  },

  entry: {
    // all scripts and styles can be used in Pug,
    // do not need to define JS and SCSS in the webpack entry

    // define Pug files in entry:
    index: './src/views/index.pug',      // output index.html
    about: './src/views/about/index.pug' // output about.html
    // ...
  },

  plugins: [
    // enable processing of Pug files from entry
    new PugPlugin({
      modules: [
        // module extracts CSS from style source files required in Pug
        PugPlugin.extractCss({
          // output filename of CSS files
          filename: 'assets/css/[name].[contenthash:8].css'
        })
      ]
    })
  ],

  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: PugPlugin.loader, // PugPlugin already contain the pug-loader
        options: {
          method: 'render', // fastest method to generate static HTML files
        }
      },
      {
        test: /\.(css|sass|scss)$/,
        use: ['css-loader', 'sass-loader']
      },
    ],
  },
};
```

### Usage with [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin)

Install the `pug-loader` only if you use the `html-webpack-plugin`.

```
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

A Pug template can be used in JavaScript code as template function with custom data.

Install the `pug-loader`.

```
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
    index: './src/index.js', // load a Pug template in JS
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

Load a Pug template in JavaScript. Optional you can pass any data into generated template function.

**./src/index.js**

```js
const tmpl = require('template.pug');
const html = tmpl({
  myVar: 'value',
});
```

---

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
Filters let to use other languages in Pug templates.
You can add your own [custom filters](https://pugjs.org/language/filters.html#custom-filters) to Pug.
See the [build-in filters](https://webdiscus.github.io/pug-loader/pug-filters).

### `plugins`

Type: `Array<Object>` Default: `[]`<br>
Plugins allow to manipulate Pug tags, template content in compile process.
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
- `compile` the Pug template compiles into a template function and in JavaScript can be called with variables to render into HTML at runtime. \
  The query parameter is `?pug-compile`. Can be used if the method is `render`. \
  Use this method, if the template have variables passed from JavaScript at runtime. [see usage](#method-compile)
- `render` the Pug template renders into HTML at compile time and exported as a string.
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
The custom data will be passed in all Pug templates, it can be useful by pass global data.

> ⚠️ Limitation by the `compile` method. \
> A string representing the source code of the function is limited by the `function.toString()`, see [examples](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/toString#examples). \
> For native work of the function passed via the `data` loader option, use the `render` method.

### `embedFilters`
Type: `Object` Default: `undefined`<br>
Enable embedded Pug filters.
To enable a filter, add the following to the pug-loader options:
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

> See the complete information on the [pug filter](https://webdiscus.github.io/pug-loader/pug-filters/) site and in the [sources](https://github.com/webdiscus/pug-loader/tree/master/examples/pug-filters).

### `watchFiles`
Type: `Array<RegExp>` Default: `[ /\.(pug|jade|js.{0,2}|.?js|ts.?|md|txt)$/i ]`<br>
This option allows you to configure a list of `RegExp` to watch for file changes in resolved dependencies.\
The default value enables watching of Pug, scripts, markdown, etc. 
and ignores images, styles to avoid double processing via Webpack and via Pug's own compiler.

In some cases, you may want to use one SCSS file for styling 
and include another SCSS file with a Pug filter for code syntax highlighting.
The first SCSS file is watched via Webpack, but changes in the second will be ignored.\
For example, we want to watch for changes in all source examples such as `main.c`, `colors.scss`, etc. from the `/code-samples/` folder, 
to do this, add to the `watchFiles` option:

```js
{
  watchFiles: [
    /\\/code-samples\\/.+$/,
  ]
}
```
> **Note:** Default RegExp array will be extends, not overridden.

---

<a id="method-compile" name="method-compile" href="#method-compile"></a>
## Usage of `compile` method

This method is used by default.\
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

To render the Pug direct into HTML, use the query parameter `?pug-render`.

```js
// compile into template function, because loader option 'method' defaults is 'compile'
const tmpl = require('template.pug');
const html = tmpl({ key: 'value' });

// render the Pug file into HTML, using the parameter 'pug-render'
const html2 = require('template2.pug?pug-render');
```

> **Note:** if the query parameter `pug-render` is set, then will be used rendering for this template, independent of the loader option `method`.
> Variables passed in template with method `render` will be used at compile time.

---

<a id="method-render" name="method-render" href="#method-render"></a>
## Usage of `render` method

This method will render the Pug into HTML at compile time. \
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

To generate a template function for passing the data in Pug at realtime, use the query parameter `?pug-compile`.

```js
// render into HTML, because loader option 'method' is 'render'
const html = require('template.pug');

// compile into template function, using the parameter 'pug-compile'
const tmpl2 = require('template2.pug?pug-compile');
const html2 = tmpl2({ ... });
```

---

<a id="method-html" name="method-html" href="#method-html"></a>
## Usage of `html` method

This method will render the Pug to pure HTML and should be used with an additional loader to handle HTML. \
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

---

<a id="embed-filters" name="embed-filters" href="#embed-filters"></a>
## Embedded filters

The goal of embedded filters is to use most useful lightweight filters without installation.
The embedded filters are [custom filters](https://pugjs.org/langucage/filters.html#custom-filters) that are collected in [one place](https://github.com/webdiscus/pug-loader/tree/master/src/filters).
These filters can be simply enabled via an option.\
See the complete information on the [pug filter](https://webdiscus.github.io/pug-loader/pug-filters/) site and in the [sources](https://github.com/webdiscus/pug-loader/tree/master/examples/pug-filters).

Defaults all embedded filters are disabled. Enable only filters used in your Pug templates.

<a id="filter-escape" name="filter-escape" href="#filter-escape"></a>
### `:escape`
The filter replaces reserved HTML characters with their corresponding HTML entities to display these characters as text.

Filter options: `none`.

Enable the filter:

```js
{
  test: /\.pug$/,
    loader: '@webdiscus/pug-loader',
    options: {
    // enable embedded filters
    embedFilters: {
      escape: true, // enable the :escape filter
    },
  },
},
```

Using the `:escape` filter in pug:

```html
pre: code.language-html
:escape
<h1>Header</h1>
```

Generated HTML:

```html
<pre>
  <code class="language-html">
    &lt;h1&gt;Header&lt;/h1&gt;
  </code>
</pre>
```

Inline syntax:
```html
p.
The #[:escape <html>] element is the root element.<br>
Inside the #[:escape <html>] element there is a #[:escape <body>] element.
```

Generated HTML:
```html
<p>The &lt;html&gt; element is the root element.<br>
  Inside the &lt;html&gt; element there is a &lt;body&gt; element.</p>
```

> For more information and examples, see the [:escape](https://webdiscus.github.io/pug-loader/pug-filters/escape.html) site.

<a id="filter-code" name="filter-code" href="#filter-code"></a>
### `:code`
The  filter wraps a content with the `<code>` tag.

Filter options:
- `className {string}` The class name of the `code` tag. For example, the `prismjs` use the `language-*` as class name in `<code>` for styling this tag.

Enable the filter:

```js
{
  test: /\.pug$/,
    loader: '@webdiscus/pug-loader',
    options: {
    // enable embedded filters
    embedFilters: {
      // enable the :code filter
      code: {
        className: 'language-', // class name of `<code>` tag, needed for `prismjs` theme
      },
    },
  },
},
```

Usage examples:

Pug: `#[:code function() { return true }]`\
Display: `function() { return true }`

Pug: `#[:code:escape <div>]`\
Display: `<div>`

Pug: `#[:code:highlight(html) <div class="container">content</div>]`\
Display highlighted code: `<div class="container">content</div>`

> For more information and examples, see the [:code](https://webdiscus.github.io/pug-loader/pug-filters/code.html) site.

<a id="filter-highlight" name="filter-highlight" href="#filter-highlight"></a>
### `:highlight`
The  filter highlights code syntax.

Filter options:
- `verbose {boolean}` Enable output process info in console.
- `use {string}` The name of a highlighting npm module. The module must be installed. Currently, is supported the [prismjs](https://prismjs.com) only.

Enable the filter:

```js
{
  embedFilters: {
    highlight: {
      verbose: true,
        use: 'prismjs',
    },
  },
}
```

Usage example:
```pug
pre.language-: code
  :highlight(html)
    <!-- Comment -->
    <h1>Header</h1>
    <p>Text</p>
```

> For more information and examples, see the [:highlight](https://webdiscus.github.io/pug-loader/pug-filters/highlight.html) site.

<a id="filter-markdown" name="filter-markdown" href="#filter-markdown"></a>
### `:markdown`
The filter transform markdown to HTML and highlights code syntax.

The `:markdown` filter require the [markdown-it](https://github.com/markdown-it/markdown-it) and [prismjs](https://prismjs.com) modules:
```
npm install -D markdown-it prismjs
```

Enable the filter:
```js
{
  test: /.pug$/,
    loader: '@webdiscus/pug-loader',
    options: {
    // enable embedded filters
    embedFilters: {
      // enable :markdown filter
      markdown: {
        // enable highlighting in markdown
        highlight: {
          verbose: true,
            use: 'prismjs',
        },
      },
    },
  },
},
```

The `highlight` options:

- `verbose {boolean}` Enable output process info in console. Use it in development mode only. Defaults is false.
- `use {string}` The name of a highlighting npm module. The module must be installed. Currently, is supported the [prismjs](https://prismjs.com) only.

Usage example:
```pug
  :markdown
    _HTML_
    ```html
    <!-- Comment -->
    <div class="container">
      <p>Paragraph</p>
    </div>
    ```
    _JavaScript_
    ```js
    const arr = [1, 2, 'banana'];
    ```
```

Display highlighted code blocks:

> _HTML_
> ```html
> <!-- Comment -->
> <div class="container">
>   <p>Paragraph</p>
> </div>
> ```
> _JavaScript_
> ```js
> const arr = [1, 2, 'banana'];
> ```

> For more information and examples, see the [:markdown](https://webdiscus.github.io/pug-loader/pug-filters/markdown.html) site.

---

<a id="passing-data-into-template" name="passing-data-into-template" href="#passing-data-into-template"></a>
## Passing data into template

### In JavaScript

By default, the Pug file is compiled as template function, into which can be passed an object with template variables.

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

Use variables `myVar` and `foo` in Pug template.

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

Use the object `myData` in Pug template.

```pug
html
head
  title= myData.title
body
  div UUID: #{myData.options.uuid}
```

To pass global data to all Pug templates, add the loader options `data` as any object.

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

The user data can be passed into Pug template with two ways:

- via HtmlWebpackPlugin options
- via query parameters of template file

```js
module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      title: 'The some page', // avaliable in Pug as `htmlWebpackPlugin.options.title`
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

Use the passed variables `htmlWebpackPlugin.options` and `myVar` in Pug template:

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

---

<a id="usage-embedded-resources" name="usage-embedded-resources" href="#usage-embedded-resources"></a>
## Usage of embedded resources

To handle resources in Pug with webpack use the `require()` function:

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
img(src=require('/assets/images/image.jpeg'))
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
```js
resolve: {
  alias: {
    Images: path.join(__dirname, 'src/assets/images/'),
  },
}
```

| Example in Pug template                                                                      | @webdiscus/<br>pug-loader<br>`render` / `html` methods | @webdiscus/<br>pug-loader<br>`compile` method | pugjs/<br>pug-loader |
|----------------------------------------------------------------------------------------------|:------------------------------------------------------:|:---------------------------------------------:|:--------------------:|
| `img(src=require('logo.png'))`                                                               |                           ✅                            |                       ❌                       |          ❌           |
| `img(src=require('./logo.png'))`                                                             |                           ✅                            |                       ✅                       |          ✅           |
| `img(src=require('../images/logo.png'))`                                                     |                           ✅                            |                       ✅                       |          ✅           |
| `img(src=require('~Images/logo.png'))`                                                       |                           ✅                            |                       ✅                       |          ✅           |
| `- var file = 'logo.png'`<br>``img(src=require(`~Images/${file}`))``                         |                           ✅                            |                       ✅                       |          ✅           |
| `- var file = './logo.png'`<br>`img(src=require(file))`                                      |                           ✅                            |                       ✅                       |          ❌           |
| `- var file = './images/logo.png'`<br>`img(src=require(file))`                               |                           ✅                            |                       ✅                       |          ❌           |
| `- var file = '../images/logo.png'`<br>`img(src=require(file))`                              |                           ✅                            |                       ❌                       |          ❌           |
| `- var file = 'logo.png'`<br>``img(src=require(`./images/${file}`))``                        |                           ✅                            |                       ✅                       |          ✅           |
| `- var file = 'logo.png'`<br>`img(src=require('../images/' + file))`                         |                           ✅                            |                       ✅                       |          ✅           |
| resolve a resource<br>when used mixin and require in same file<br>see the [pug-loader issue] |                           ✅                            |                       ✅                       |          ❌           |

---

<a id="usage-with-angular" name="usage-with-angular" href="#usage-with-angular"></a>
## Usage with Angular

Install:

```
npm i --save-dev @webdiscus/pug-loader pug-plugin-ng
```
> In pug-loader can be used the optional [**pug-plugin-ng**](https://www.npmjs.com/package/pug-plugin-ng)
> to allow unquoted syntax of Angular: `[(bananabox)]="val"`

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

In a component file, e.g. `./src/app/app.component.ts` set the `templateUrl` with Pug file:
```js
import { Component } from '@angular/core';

// the variable `description` will be passed into Pug template via resource query
const templateVars = '{"description": "Use Pug template with Angular."}';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.css'],
  templateUrl: './app.component.pug?' + templateVars,
})
export class AppComponent {
  title = 'ng-app';
}
```

Create a Pug template, e.g. `./src/app/app.component.pug`:

```pug
h1 Hello Pug!
p Description: #{description}
```

See [the complete source of the example](https://github.com/webdiscus/pug-loader/tree/master/examples/angular-component-render/).

---

<a id="usage-with-vue" name="usage-with-vue" href="#usage-with-vue"></a>
## Usage with Vue

Install:

```
npm i --save-dev @webdiscus/pug-loader
```

Change your `vue.config.js` according to the following minimal configuration:
```js
const { defineConfig } = require('@vue/cli-service');

// additional pug-loader options, 
// e.g. to enable pug filters such as `:highlight`, `:markdown`, etc.
// see https://github.com/webdiscus/pug-loader#options
const pugLoaderOptions = {
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
```

For additional information see please the discussion:
[How to configure the plugin for both Vue and non-Vue usage?](https://github.com/webdiscus/pug-loader/discussions/16)


**Usage Pug in Vue template**

```html
<template lang='pug'>
  h1 Hello Pug!
  p Paragraph
</template>
```
**Note:** you can use an indent for Pug code in Vue template.

**Usage Pug in JavaScript**

App.vue
```html
<template>
  <div v-html='demo'></div>
</template>

<script>
  // import Pug as template function
  import demoTmpl from './views/demo.pug';
  
  // define custom data used in Pug template
  const locals = { colors: ['red', 'green', 'blue'] };
  // pass custom data in Pug template
  const demoHtml = demoTmpl(locals);

  export default {
    name: 'App',
    data() {
      return {
        demo: demoHtml
      }
    }
  }
</script>
```

demo.pug
```pug
each color in colors
  div(style=`color: ${color}`) #{color}
```

**Note:** the `colors` is external variable passed from App.vue.

---

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

### Usage of JavaScript in Pug

Use the `require()` for CommonJS files in Pug templates. \
The JS module **say-hello.js**

```js
module.exports = function(name) {
  return `Hello ${name}!`;
}
```

Use the module `sayHello` in Pug template.

```pug
- var sayHello = require('./say-hello')
h1 #{sayHello('pug')}
```

---

## Testing

`npm run test` will run the unit and integration tests.\
`npm run test:coverage` will run the tests with coverage.

---

## Also See

- more examples of usages see in [test cases](https://github.com/webdiscus/pug-loader/tree/master/test/cases)
- [ansis][ansis] - ANSI color styling of text in terminal
- [pug GitHub][pug]
- [pug API Reference][pug-api]
- [pug-plugin][pug-plugin]
- [Pug filters][pug-filters] embedded in the pug-loader

## License

[ISC](https://github.com/webdiscus/pug-loader/blob/master/LICENSE)

[ansis]: https://github.com/webdiscus/ansis
[pug]: https://github.com/pugjs/pug
[pug-api]: https://pugjs.org/api/reference.html
[pug-plugin]: https://github.com/webdiscus/pug-plugin
[pug-loader issue]: https://github.com/pugjs/pug-loader/issues/123

[Pug filters]: https://webdiscus.github.io/pug-loader/pug-filters
[`:escape`]: https://webdiscus.github.io/pug-loader/pug-filters/escape.html
[`:code`]: https://webdiscus.github.io/pug-loader/pug-filters/code.html
[`:highlight`]: https://webdiscus.github.io/pug-loader/pug-filters/highlight.html
[`:markdown`]: https://webdiscus.github.io/pug-loader/pug-filters/markdown.html
