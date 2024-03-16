<div align="center">
    <h1>
        <a href="https://pugjs.org">
            <img height="120" src="https://cdn.rawgit.com/pugjs/pug-logo/eec436cee8fd9d1726d7839cbe99d1f694692c0c/SVG/pug-final-logo-_-colour-128.svg">
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
[![Test](https://github.com/webdiscus/pug-loader/actions/workflows/test.yml/badge.svg)](https://github.com/webdiscus/pug-loader/actions/workflows/test.yml)
[![codecov](https://codecov.io/gh/webdiscus/pug-loader/branch/master/graph/badge.svg?token=457T2BK3YN)](https://codecov.io/gh/webdiscus/pug-loader)
[![node](https://img.shields.io/npm/dm/@webdiscus/pug-loader)](https://www.npmjs.com/package/@webdiscus/pug-loader)

The Pug Loader renders Pug templates into HTML or compiles it into a template function.

### 🚀 [Install and Quick Start](#install-and-quick-start)

## 💡 Highlights

- Resolves paths and aliases for **extends**, **include**.
- Resolves **source asset** files in tag attributes via **require()** function.
- Resolves **source JS/JSON** files in Pug code via **require()** function.
- Resolves alias from webpack **resolve.alias** or **tsconfig.json**.
- Renders Pug template into pure **HTML string**.
- Compiles Pug template into **template function** for render template in the browser.
- Generates a template function with both **CommonJS** and **ESM** syntax.
- Pass data into template from the loader options.
- Build-in [Pug filters]: [`:escape`] [`:code`] [`:highlight`] [`:markdown`] with highlighting of code blocks
- Supports an indent in [Vue template](#using-with-vue), see [source of an example](https://github.com/webdiscus/pug-loader/tree/master/examples/hello-world-vue).
- Watching of changes in all dependencies.

> **Warning**
> 
> Until today, **2024**, only this Pug loader **is maintained**. Please support this project by giving it a star ⭐.\
> All **other Pug loaders are dead** and have not been maintained for a long time:
>
> - [pug-loader](https://www.npmjs.com/package/pug-loader) - last update 2018 (6 years ago)
> - [pug-html-loader](https://npmjs.com/package/pug-html-loader) - last update 2016 (8 years ago)
> - [pug-plain-loader](https://www.npmjs.com/package/pug-plain-loader) - last update 2020 (4 years ago)
> - [simple-pug-loader](https://npmjs.com/package/simple-pug-loader) - last update 2021 (3 years ago)

> **Note**
> 
> Instead of `html-webpack-plugin` recommended to use [pug-plugin](https://github.com/webdiscus/pug-plugin) or [html-bundler-webpack-plugin ](https://github.com/webdiscus/html-bundler-webpack-plugin).
> 
> The **Pug Plugin** allow to use a template as an **entrypoint** and generates static HTML or [template function](https://github.com/webdiscus/html-bundler-webpack-plugin#template-in-js) from Pug template containing source files of scripts, styles, images, fonts and other resources, similar to how it works in [Vite](https://vitejs.dev/guide/#index-html-and-project-root).
>
>  Please see [usage examples](https://github.com/webdiscus/pug-plugin#usage-examples) and the demo app [Hello World](https://github.com/webdiscus/pug-plugin/tree/master/examples/hello-world).

## Contents

1. [Install and Quick start](#install-and-quick-start)
   - [Using pug-plugin](#using-pug-plugin)
   - [Using html-webpack-plugin](#using-html-webpack-plugin)
2. [Options](#options)
3. [Using modes](#mode-compile)
   - [compile](#mode-compile)
   - [render](#mode-render)
   - [html](#mode-html)
4. [Using Pug filters](#embed-filters)
   - [:escape](#filter-escape)
   - [:code](#filter-code)
   - [:highlight](#filter-highlight)
   - [:markdown](#filter-markdown)
5. [Passing data into Pug template](#passing-data-into-template)
6. [Using resources](#using-resources)
7. [Path Resolving](#resolve-resource-path)
   - [Path aliases with Webpack](#resolve-webpack-alias)
   - [Path aliases with TypeScript](#resolve-tsconfig-alias)
   - [Root path with Webpack context](#resolve-webpack-context)
   - [Relative path](#resolve-relative-path)
   - [Interpolation](#resolve-interpolation)
9. [Using with Angular](#using-with-angular)
10. [Using with Vue](#using-with-vue)
11. [Recipes](#recipes)
12. [Example Hello World!](https://github.com/webdiscus/pug-loader/tree/master/examples/hello-world-app/)
13. [Example Pug filters](https://github.com/webdiscus/pug-loader/tree/master/examples/pug-filters)
14. [More examples](https://github.com/webdiscus/pug-loader/tree/master/test/cases)


<a id="install-and-quick-start" name="install-and-quick-start" href="#install-and-quick-start"></a>
## Install and Quick start

**Choose your way:**

- Using the [pug-plugin](https://github.com/webdiscus/pug-plugin).
  It is a **very easy** intuitive way.
- Using the [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin) with the **pug-loader**.
  It is a **very complex** non-intuitive way.

<a id="using-pug-plugin" name="using-pug-plugin"></a>
### Using only the [pug-plugin](https://github.com/webdiscus/pug-plugin)

The **pug-plugin** contains already the **pug** and **pug-loader** packages.
For details and examples please see the [pug-plugin](https://github.com/webdiscus/pug-plugin) site.

Install the `pug-plugin`:

```
npm install pug-plugin --save-dev
```

Install additional packages for styles:

```
npm install css-loader sass-loader sass --save-dev
```

Start with a Pug template. Add the `link` and `script` tags.
You can include asset source files such as SCSS, JS, images, and other media files directly in a Pug template.

The plugin resolves `script(src="...")` `link(href="...")` and `img(src="..." srcset="...")` that references your script, style and image source files.

For example, there is the template ./src/views/home.pug:

```pug
html
  head
    //- variable from Webpack config
    title= title
    //- relative path to favicon source file
    link(href="./favicon.ico" rel="icon")
    //- relative path to SCSS source file
    link(href="./style.scss" rel="stylesheet")
    //- relative path to JS source file -->
    script(src="./main.js" defer="defer")
  body
    h1 Hello World!
    //- relative path to image source file
    img(src="./picture.png")
```

All source filenames should be relative to the entrypoint template, or you can use [Webpack alias](https://webpack.js.org/configuration/resolve/#resolvealias).
The references are rewritten in the generated HTML so that they link to the correct output files.

The generated HTML contains URLs of the output filenames:

```html
<html>
  <head>
    <title>Homepage</title>
    <link href="img/favicon.3bd858b4.ico" rel="icon" />
    <link href="css/style.05e4dd86.css" rel="stylesheet" />
    <script src="js/main.f4b855d8.js" defer="defer"></script>
  </head>
  <body>
    <h1>Hello World!</h1>
    <img src="img/picture.58b43bd8.png" />
  </body>
</html>
```

If the `entry` plugin option is a path, the plugin finds all templates automatically
and keep the same directory structure in the output directory.

If the `entry` plugin option is an object, the key is an output filename without `.html` extension and the value is a template file.

Very simple and clear **webpack.config.js**, all relevant settings are in one place, in plugin options:

```js
const path = require('path');
const PugPlugin = require('pug-plugin');

module.exports = {
  output: {
    path: path.join(__dirname, 'dist/'),
  },

  plugins: [
    new PugPlugin({
      // automatically processing all templates in the path
      entry: 'src/views/',
      // - OR - define many pages manually (key is output filename w/o `.html`)
      entry: {
        // simple page config w/o variables
        index: 'src/views/home.pug', // => dist/index.html
        // advanced page config with variables
        'news/sport': { // => dist/news/sport.html
          import: 'src/views/news/sport/index.pug', // template file
          data: { title: 'Sport news' }, // pass variables into template
        },
      },
      data: {...}, // pass global data into all templates
      js: {
        // JS output filename, used if `inline` option is false (defaults)
        filename: 'js/[name].[contenthash:8].js',
        //inline: true, // inlines JS into HTML
      },
      css: {
        // CSS output filename, used if `inline` option is false (defaults)
        filename: 'css/[name].[contenthash:8].css',
        //inline: true, // inlines CSS into HTML
      },
    })
  ],

  module: {
    rules: [
      {
        test: /\.(s?css|sass)$/,
        use: ['css-loader', 'sass-loader']
      },
      {
        test: /\.(ico|png|jp?g|webp|svg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'img/[name].[hash:8][ext][query]',
        },
      },
    ],
  },
};
```

> **Note**
> 
> No additional plugins or loader required.

<a id="using-html-webpack-plugin" name="using-html-webpack-plugin"></a>
### Using with [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin)

> **Warning**
>
> This way is not recommended!

Install the `@webdiscus/pug-loader` only if you use the `html-webpack-plugin`.

```
npm install @webdiscus/pug-loader html-webpack-plugin --save-dev
```

Install additional packages for styles:

```
npm install css-loader sass-loader sass --save-dev
```

Install additional plugin to extract CSS:

```
npm install mini-css-extract-plugin --save-dev
```

Using the `html-webpack-plugin` you should require a source asset file in the Pug template. 

For example, there is the template ./src/views/home.pug:

```pug
html
  head
    //- variable from plugin options, very ugly access
    title= htmlWebpackPlugin.options.data.title
    //- relative path to favicon source file
    link(href=require("./favicon.ico") rel="icon")
    //- JS and CSS will be injected into HTML automatically, anywhere here
    //- Note: you have no control over the position or order of injected files
  body
    h1 Home
    //- relative path to image source file
    img(src=require("./picture.png"))
```

Very complex **webpack.config.js**:

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  output: {
    path: path.join(__dirname, 'dist/'),
    // JS output filename must be defined only here
    filename: 'js/[name].[contenthash:8].js',
  },

  entry: {
    // Source files of styles and scripts must be defined here, separately from their templates.
    // How to bind each generated bundle to the HTML page?
    // Answer: using the `chunks` plugin option.
    index: ['./src/views/home/main.js', './src/views/home/style.scss'],
    'news/sport': ['./src/views/news/sport/main.js', './src/views/news/sportstyle.scss'],
  },

  plugins: [
    // For one page must be initialized the plugin instance.
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/views/home/index.pug'),
      // HTML output filename
      filename: 'index.html',
      // bind the generated JS and CSS files to this template via chunks,
      // this is a very terrible "crutch"
      chunks: ['index'],
      // pass variables into template,
      // access in template is very ugly: `htmlWebpackPlugin.options.data.title`
      data: { title: 'Home' }
    }),

    // For other page must be initialized yet one plugin instance.
    // It's very very bad practice and ugly syntax!
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/views/news/sport/index.pug'),
      // HTML output filename
      filename: 'news/sport.html',
      // bind the generated JS and CSS files to this template via chunks option,
      // you're not confused yet using chunks?
      chunks: ['news/sport'],
      // access in template is very ugly: `htmlWebpackPlugin.options.data.title`,
      // using `pug-plugin`, the variable in Pug is accessible w/o any scope: `title` 
      // (of cause, in `pug-plugin` you can define a variable scope, if you want)
      data: { title: 'Sport news' }
    }),
    
    // ... Do you have the joy of adding yet one page using the HtmlWebpackPlugin?
    // No? Then try to use the `pug-plugin`.

    // Yet one plugin to extract CSS and inject one into HTML.
    new MiniCssExtractPlugin({
      // CSS output filename defined in another place, here
      filename: 'css/[name].[contenthash:8].css',
    }),
  ],

  module: {
    rules: [
      // requires to define the pug loader
      {
        test: /\.pug$/,
        loader: '@webdiscus/pug-loader',
      },
      {
        test: /\.(s?css|sass)$/,
        // requires additional MiniCssExtractPlugin loader
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|jpe?g|ico)/,
        type: 'asset/resource',
        generator: {
          filename: 'img/[name].[hash:8][ext]',
        },
      },
    ],
  },
};
```

Why do many developers switch from Webpack to other bundlers?
One of the reasons they cite is the complex configuration many different plugins and loaders for one simple thing - rendering an HTML page with assets.

The [pug-plugin](https://github.com/webdiscus/pug-plugin) "changes the rule of the game".
Just one plugin replaces the functionality of many [plugins and loaders](https://github.com/webdiscus/html-bundler-webpack-plugin#list-of-plugins) and makes configuration very simple and clear.

### Using in JavaScript

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

### `mode`

> **Warning**
> 
> Since the version `2.11.0`, the `method` option name is renamed into `mode`.\
> The `method` option is **DEPRECATED**.
> 
> The `method` values are renamed:
> - `pug-compile` => `compile`
> - `pug-render` => `render`
> 
> The `method` option name and _old_ values can be used until the next major version.

Type: `string` Default: `compile`<br>
Values:
- `compile` the Pug template compiles into a template function and in JavaScript can be called with variables to render into HTML at runtime. \
  The query parameter is `?compile`. Can be used if the mode is `render`. \
  Use this mode, if the template have variables passed from JavaScript at runtime. [see usage](#mode-compile)
- `render` the Pug template renders into HTML at compile time and exported as a string.
  All required resource will be processed by the webpack and separately included as added strings wrapped to a function. \
  The query parameter is `?render`. Can be used if the mode is `compile` or is not defined in options. \
  Use this mode, if the template does not have variables passed from JavaScript at runtime. The mode generates the most compact and fastest code. [see usage](#mode-render)
- `html` the template renders into a pure HTML string at compile time. The mode need an addition loader to handles the HTML. \
  Use this mode if the rendered HTML needs to be processed by additional loader, e.g. by `html-loader` [see usage](#mode-html)

> Asset resources such as `img(src=require('./image.jpeg'))` are handled at compile time by the webpack using [**asset/resource**](https://webpack.js.org/guides/asset-modules/#resource-assets).

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

> **Note:**
> The option `esModule` is irrelevant for the `html` mode, because it returns a pure HTML string.

💡 For generates smaller and faster template function, it is recommended to use following options:

```js
{
  mode: 'render',
  esModule: true,
}
```

### `data`

Type: `Object` Default: `{}`<br>
The custom data will be passed in all Pug templates, it can be useful by pass global data.

> ⚠️ Limitation with the `compile` mode.\
> A string representing the source code of the function is limited by the `function.toString()`, see [examples](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/toString#examples). \
> For native work of the function passed via the `data` loader option, use the `render` mode.

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

Where `<FILTER_NAME>` is the name of a built-in filter, the available filters see below.
The filter can have options `<FILTER_OPTIONS>` as an object.
If the filter has no options, use `true` as an option to enable the filter.

> See the complete information on the [pug filter](https://webdiscus.github.io/pug-loader/pug-filters/) site and in the [sources](https://github.com/webdiscus/pug-loader/tree/master/examples/pug-filters).

### `watchFiles`
Type: `Array<RegExp|string>` Default: `[ /\.(pug|jade|js.{0,2}|.?js|ts.?|md|txt)$/i ]`<br>
This option allows you to configure watching of individual resolved dependencies.\
The default value enables watching of Pug, scripts, markdown, etc. 
and ignores images, styles to avoid double processing via Webpack and via Pug's ist own compiler.

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

For watching of a file, add full path, for example:
```js
{
  watchFiles: [
    path.join(__dirname, './src/config.yml'),
  ]
}
```

> **Note:**
> Default value of `watchFiles` will be extends, not overridden.

---

<a id="mode-compile" name="mode-compile" href="#mode-compile"></a>
## Using `compile` mode

This mode is used by default.\
In JavaScript the required template will be compiled into template function.\
In webpack config add to `module.rules`:

```js
{
  test: /\.pug$/,
    loader: '@webdiscus/pug-loader',
    options: {
    mode: 'compile' // default mode `compile` can be omitted
  }
}
```
In JavaScript, the result of require() is a template function. Call the template function with some variables to render it to HTML.
```js
const tmpl = require('template.pug');
const html = tmpl({ key: 'value' }); // the HTML string
```

To render the Pug direct into HTML, use the query parameter `?render`.

```js
// compile into template function, because loader option 'mode' defaults is 'compile'
const tmpl = require('template.pug');
const html = tmpl({ key: 'value' });

// render the Pug file into HTML, using the parameter 'render'
const html2 = require('template2.pug?render');
```

> **Note:**
> If the query parameter `render` is set, then will be used rendering for this template, independent of the loader option `mode`.
> Variables passed in template with mode `render` will be used at compile time.

---

<a id="mode-render" name="mode-render" href="#mode-render"></a>
## Using `render` mode

This mode will render the Pug into HTML at compile time. \
In webpack config add to `module.rules`:

```js
{
  test: /\.pug$/,
    loader: '@webdiscus/pug-loader',
    options: {
      mode: 'render',
    },
}
```

In JavaScript the result of require() is an HTML string.

```js
const html = require('template.pug'); // the HTML string
```

To generate a template function for passing the data in Pug at realtime, use the query parameter `?compile`.

```js
// render into HTML, because loader option 'mode' is 'render'
const html = require('template.pug');

// compile into template function, using the parameter 'compile'
const tmpl2 = require('template2.pug?compile');
const html2 = tmpl2({ ... });
```

---

<a id="mode-html" name="mode-html" href="#mode-html"></a>
## Using `html` mode

This mode will render the Pug to pure HTML and should be used with an additional loader to handle HTML. \
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
        mode: 'html',
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
## Built-in filters

The goal of built-in filters is to use most useful lightweight filters without installation.
The built-in filters are [custom filters](https://pugjs.org/langucage/filters.html#custom-filters) that are collected in [one place](https://github.com/webdiscus/pug-loader/tree/master/src/filters).
These filters can be simply enabled via an option.\
See the complete information on the [pug filter](https://webdiscus.github.io/pug-loader/pug-filters/) site and in the [sources](https://github.com/webdiscus/pug-loader/tree/master/examples/pug-filters).

Defaults all built-in filters are disabled. Enable only filters used in your Pug templates.

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
    // enable built-in filters
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
    // enable built-in filters
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
    // enable built-in filters
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

<a id="using-resources" name="using-resources" href="#using-resources"></a>
## Using resources

To handle resources in Pug use the `require()` function:

```pug
img(src=require('./path/to/images/logo.png'))
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

<a id="resolve-resource-path" name="resolve-resource-path" href="#resolve-resource-path"></a>
## Path Resolving

<a id="resolve-webpack-alias" name="resolve-webpack-alias" href="#resolve-webpack-alias"></a>
### Path aliases with Webpack

Recommended to use the Webpack alias to avoid relative paths in Pug.\
For example, use the alias `Images` as path to images:
```js
module.exports = {
  resolve: {
    alias: {
      Images: path.join(__dirname, 'src/assets/images/'),
    },
  }
};
```

The alias may be used with prefixes `~` or `@`.\
For example, all following aliases resolves the same path:
```pug
img(src=require('Images/logo.png'))
img(src=require('~Images/logo.png'))
img(src=require('@Images/logo.png'))
```

<a id="resolve-tsconfig-alias" name="resolve-tsconfig-alias" href="#resolve-tsconfig-alias"></a>
### Path aliases with TypeScript

Using `TypeScript` you can define an alias in `tsconfig.json`.
But for performance is recommended to use the Webpack alias.\
For example, add to `tsconfig.json` an alias to the `paths` option:

**tsconfig.json**

```js 
{
  "compilerOptions": {
    "paths": {
      "Images/*": ["assets/images/*"]
    }
  }
}
```

> **Warning**
>
> The `compile` mode can resolve the filename as a string only and the filename can't be interpolated.
> ```pug
> img(src=require('Images/logo.png')) // It works.
> 
> - const file = 'logo.png'
> img(src=require('Images/' + file))  // ERROR: Can't be resolved with 'compile' mode. 
> ```

<a id="resolve-webpack-context" name="resolve-webpack-context" href="#resolve-webpack-context"></a>
### Root path with Webpack context

You can use the Webpack `context` for a short path in Pug.\
Define in Webpack config the `context` as path to sources:
```js
module.exports = {
  context: path.resolve(__dirname, 'src'),
};
```

For example, your images are under the path `PROJECT_PATH/src/assets/images/`, 
then using the `context` you can use the root path (relative by context) anywhere:
```pug
img(src=require('/assets/images/logo.png'))
```

> **Note**
> 
> You can use the `basedir` option of pug-loader for same effect:
> ```js
> module.exports = {
>   module: {
>     rules: [
>       {
>         test: /\.pug$/,
>         loader: '@webdiscus/pug-loader',
>         options: {
>           basedir: path.resolve(__dirname, 'src')
>         },
>       },
>     ],
>    },
>  };
> ```

<a id="resolve-relative-path" name="resolve-relative-path" href="#resolve-relative-path"></a>
### Relative path
The file in the current- or subdirectory `MUST` start with `./`:

```pug
img(src=require('./path/to/logo.png'))
```

The file in the parent directory `MUST` start with `../`:

```pug 
img(src=require('../images/logo.png'))
```

> **Warning**
>
> Following relative path will be resolved with `render` and `html` modes, but `NOT` with `compile` mode:
> ```pug 
>   img(src=require('../../images/logo.png'))
> ```
> This is an interpolation limitation in Webpack.

<a id="resolve-interpolation" name="resolve-interpolation" href="#resolve-interpolation"></a>
### Interpolation

You can use the filename as a variable.

Usage examples work with all modes:
```pug
- const file = 'logo.png'
img(src=require('./images/' + file))
img(src=require(`./images/${file}`))
img(src=require('../images/' + file))
img(src=require('Images/' + file)) // 'Images' is webpack alias
img(src=require(`Images/${file}`)
```

> **Warning**
>
> Limitation using the `compile` mode:\
> the variable `MUST NOT` contain a path, only a filename, because is interpolated at compile time.\
> For example, the 'compile' mode can't resolve following:
> ```pug
>   - var file = '../images/logo.png'
>   img(src=require(file))
> ```

Using a variable with `render` or `html` mode, the variable `MAY` contain a path, because is resolved at runtime.\
Following example work only with `render` or `html` mode:
```pug
- const file = '../relative/path/to/logo.png'
img(src=require(file))
img(src=require('Images/' + file))
```

In current directory, the filename `MUST` start with `./`:

```pug
- const file = './logo.png'
img(src=require(file))
```

---

<a id="using-with-angular" name="using-with-angular" href="#using-with-angular"></a>
## Using with Angular

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
          mode: 'render',
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
    },
  },
},
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

See the complete [source](https://github.com/webdiscus/pug-loader/tree/master/examples/angular-component/) of the example.

---

<a id="using-with-vue" name="using-with-vue" href="#using-with-vue"></a>
## Using with Vue

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
    // clear all existing pug loaders
    const pugRule = config.module.rule('pug');
    pugRule.uses.clear();
    pugRule.oneOfs.clear();

    // exclude `pug-loader` from the witchery of the baggy `thread-loader` that is used in production mode
    const jsRule = config.module.rule('js');
    jsRule.exclude.add(/pug-loader/);
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
                mode: 'html', // render Pug into pure HTML string
                ...pugLoaderOptions,
              },
            },
            // allow import of Pug in JavaScript
            {
              loader: '@webdiscus/pug-loader',
              options: {
                mode: 'compile', // compile Pug into template function
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


**Using Pug in Vue template**

```html
<template lang='pug'>
  h1 Hello Pug!
  p Use the '@webdiscus/pug-loader'
</template>
```
> **Note**
> 
> You can use an indent for Pug code in Vue template.

**Using Pug in JavaScript**

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

> **Note:**
> The `colors` is external variable passed from App.vue.

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

### Using JavaScript in Pug

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
- [Pug filters]
- [html-bundler-webpack-plugin][html-bundler-webpack-plugin] - The plugin handles HTML template as entry point, extracts CSS, JS, images from their sources loaded directly in HTML


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

[html-bundler-webpack-plugin]: https://github.com/webdiscus/html-bundler-webpack-plugin
