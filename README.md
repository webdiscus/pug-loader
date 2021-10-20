[![npm version](https://badge.fury.io/js/@webdiscus%2Fpug-loader.svg)](https://badge.fury.io/js/@webdiscus%2Fpug-loader)

# [pug-loader](https://www.npmjs.com/package/@webdiscus/pug-loader)

Webpack loader for the [Pug](https://pugjs.org) templates.\
The `pug-loader` resolve paths and webpack aliases for `extends`/`include`/`require()` in pug template and compiles it into static HTML or into javascript template function.

Using the `HtmlWebpackPlugin`, the pug template compiles into static HTML.\
In the javascript file, the pug template loaded via `require()` compiles into template function.


## Features
 - supports **Webpack 5** and **Pug 3**
 - supports all features and options of original [`pugjs/pug-loader`](https://github.com/pugjs/pug-loader/)
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
 - all features have integration [tests](https://github.com/webdiscus/pug-loader/blob/master/test/index.test.js) processed through a webpack runner
 
Why use this particular pug loader instead of the original one?
- the original `pugjs/pug-loader` is outdated and not maintained more
- the original `pugjs/pug-loader` has error by `npm install` [see issue](https://github.com/pugjs/pug-loader/issues/126): 
  - `npm ERR! Found: pug@3.0.2 ... pug-loader@2.4.0" has incorrect peer dependency "pug@^2.0.0"`
- this pug loader is many times faster than the original `pugjs/pug-loader`
- this pug loader support Webpack `resolve.alias` also without the prefix `~`
- this pug loader watch all change in all dependencies

## Install

```console
npm install @webdiscus/pug-loader --save-dev
```

## Webpack config

For usage pug templates only in javascript is enough add to a webpack config:
```js
{
  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: '@webdiscus/pug-loader',
        options: pugLoaderOptions
      }
    ]
  }
}
```

For rendering pug templates into static HTML is needed the `HtmlWebpackPlugin`.

The complete example of the webpack config file:

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// The absolute path to the base directory of application.
const basePath = path.resolve(__dirname);

// The minimal required options for pug-loader.
const pugLoaderOptions = {};

module.exports  = {
  resolve: {
    // aliases used in the code examples below
    alias: {
      UIComponents: path.join(basePath, 'src/lib/components/ui/'),
      Images: path.join(basePath, 'src/images/'),
      Templates: path.join(basePath, 'src/templates/'),
    }
  },
  
  entry: {
    // the script used a pug template
    'script': './src/js/script.js',
  },

  output: {
    path: path.join(basePath, 'public/assets/'),
    filename: '[name].js',
  },

  plugins: [
    // this plugin extract the content of a pug template 
    // and save compiled via pug-loader content into html file
    new HtmlWebpackPlugin({
      filename: path.join(basePath, '/src/templates/index.pug'),
      template: './public/index.html',
      inject: false
    }),
  ],

  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: '@webdiscus/pug-loader',
        options: pugLoaderOptions
      }
    ]
  }
};
```

## Options

[See original description of options](https://pugjs.org/api/reference.html#options)

### `doctype`
Type: `string`<br>
Default: `html`<br>
Specifies the type of document. [See available doctypes](https://pugjs.org/language/doctype.html#doctype-option).


### `pretty`
Type: `boolean`<br>
Default: `false`<br>
This option is **deprecated** by pugjs and always is `false`. Don't use it.

### `filters`
Type: `object`<br>
Default: `undefined`<br>
Hash table of [custom filters](https://pugjs.org/language/filters.html#custom-filters).
Filters let to use other languages in Pug templates.

### `self`
Type: `boolean`<br>
Default: `false`<br>
Use the `self` as namespace for the local variables in template. It will speed up the compilation, but for access to variable, e.g. `myVariable`, you must write `self.myVariable`.

### `compileDebug`
Type: `boolean`<br>
Default: `false`<br>
Includes the function source in the compiled template to improve error reporting.

### `globals`
Type: `Array<string>`<br>
Default: `[]`<br>
Add a list of global names to make accessible in templates.

### `plugins`
Type: `Array<Object>`<br>
Default: `[]`<br>
Plugins allow to manipulate pug tags, template content in compile process.
How it works [see in source of pug](https://github.com/pugjs/pug/blob/master/packages/pug/lib/index.js).

## Usage

The example of simple file structure of an application under the path `/srv/vhost/sample.com/`:

```
.
├--public/
├--lib/
|  └--components/
|     ├--ui/
|     |  ├--layout.pug
|     |  ├--mixins.pug
|     |  └--colors.json
|     ...
├--src/
|  ├--images/
|  |  ├--image.jpeg
|  |  ├--image1.jpeg
|  |  ├--image2.jpeg
|  |  └--image3.jpeg
|  ├--js/
|  |  ├--script.js
|  |  └--data.json
|  └--templates/
|     ├--index.pug
|     └--mixins.pug
|     ├--widget.pug
└--webpack.config.js
```

The source Pug templates from `src/templates/` after compilation are saved as HTML files in `public/`.

### Usage in Pug templates

File `./src/templates/index.pug`

```pug
extends UIComponents/layout.pug
include UIComponents/mixins.pug

block content
  - const colors = require('UIComponents/colors.json')`
  
  .color-container
    +show-colors(colors)
  
```

File `./lib/components/ui/layout.pug`
```
html
  head
    block head
  body
    block content
```

File `./lib/components/ui/mixins.pug`

```pug
mixin show-colors(colors)
  each color in colors
    div(style=`background-color:${color.hex};`)= color.name

```

File `./lib/components/ui/colors.json`

```json
[
  {
    "name": "red",
    "hex": "#f00"
  },
  {
    "name": "green",
    "hex": "#0f0"
  },
  {
    "name": "blue",
    "hex": "#00f"
  }
]
```


In the sample above uses Webpack alias `UIComponents` instand of relative path `../../lib/components/ui/`.

### Usage embedded resources

For processing image resources in templates with webpack use the `require()` function:

```pug
img(src=require('./path/to/image.jpeg'))
```

For usage embedded resources is need add an asset-module to `module.rules` in webpack config:
```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg)/,
        type: 'asset/resource'
      }
    ]
  },
};
```
More information about asset-modules [see here](https://webpack.js.org/guides/asset-modules/).

### Known issues / features by usage embedded resources
Due to the peculiarities of the pug compiler,
the interpolation of the argument to the `require()` function depends on its string and variable parts.\
Use a relative path only in the string before the variable.
The variable must contain only the filename without specifying a path.

Examples of <span style="color: red">incorrect</span> usage:
```pug
- filename = './image.jpeg'
img(src=require(filename))
```
```pug
- filename = '../relative/path/to/resource/image.jpeg'
img(src=require(filename))
```

Examples of <span style="color: green">correct</span> usage:
```pug
- filename = 'image.jpeg'
img(src=require(filename))
```
```pug
- filename = 'image.jpeg'
img(src=require('../relative/path/to/resource/' + filename))
```
The example of dynamically generating embedded resources in template:
```pug
- files = ['image1.jpeg', 'image2.jpeg', 'image3.jpeg']
each file in files
  img(src=require('../images/' + file))
```

The example of webpack alias used in the table below: 
```
resolve: {
  alias: {
    SourceImages: path.join(__dirname, 'src/images/'),
  },
}
```

Examples for using embedded resources:

Code | @webdiscus/pug-loader| pugjs/pug-loader | Note
---|---|---|---
`img(src=require('image.jpeg'))`| <span style="color:green">**OK**</span> | <span style="color:red">fail</span>
`img(src=require('./image.jpeg'))`| <span style="color:green">**OK**</span> | <span style="color:green">**OK**</span>
`img(src=require('./images/image.jpeg'))`| <span style="color:green">**OK**</span> | <span style="color:green">**OK**</span>
`img(src=require('../images/image.jpeg'))`| <span style="color:green">**OK**</span> | <span style="color:green">**OK**</span>
`img(src=require('SourceImages/image.jpeg'))`| <span style="color:green">**OK**</span> | <span style="color:green">**OK**</span> | Usage of the webpack alias to images directory.
`- file = 'image.jpeg'`<br>`img(src=require('SourceImages/' + file))`| <span style="color:green">**OK**</span> | <span style="color:green">**OK**</span>
`- file = 'image.jpeg'`<br>``img(src=require(`SourceImages/${file}`))``|<span style="color:green">**OK**</span> | <span style="color:green">**OK**</span>
`- file = 'image.jpeg'`<br>`img(src=require(file))`| <span style="color:green">**OK**</span> | <span style="color:red">fail</span>
`- file = 'image.jpeg'`<br> ``img(src=require(`${file}`))``| <span style="color:green">**OK**</span> | <span style="color:red">fail</span>
`- file = 'image.jpeg'`<br>`img(src=require('./' + file))`| <span style="color:green">**OK**</span> | <span style="color:green">**OK**</span>
`- file = './image.jpeg'`<br>`img(src=require(file))`| <span style="color:red">fail</span> | <span style="color:red">fail</span> | Don't use `./` in variable of filename.
`- file = './image.jpeg'`<br>`img(src=require('' + file))`| <span style="color:red">fail</span> | <span style="color:green">**OK**</span> | Don't use `./` in variable of filename.
`- file = 'images/image.jpeg'`<br>`img(src=require(file))`| <span style="color:green">**OK**</span> | <span style="color:red">fail</span>
`- file = 'image.jpeg'`<br>`img(src=require('./images/' + file))`| <span style="color:green">**OK**</span> | <span style="color:green">**OK**</span>
`- file = 'image.jpeg'`<br>``img(src=require(`./images/${file}`))``| <span style="color:green">**OK**</span> | <span style="color:green">**OK**</span>
`- file = '../images/image.jpeg'`<br>`img(src=require(file))`| <span style="color:red">fail</span> | <span style="color:red">fail</span> | Don't use a path in a variable.
`- file = 'image.jpeg'`<br>`img(src=require('../images/' + file))`| <span style="color:green">**OK**</span> | <span style="color:green">**OK**</span> | Define a path separately as string and add to she the variable contained only a filename.
`- file = 'image.jpeg'`<br>``img(src=require(`../images/${file}`))``| <span style="color:green">**OK**</span> | <span style="color:green">**OK**</span>
`include mixins`<br>`- file = 'image.jpeg'`<br>``img(src=require(`../../images/${file}`))``| <span style="color:green">**OK**</span> | <span style="color:red">fail</span> | If a mixin file is included before the tag with the embedded resource, then `pugjs/pug-loader` does not find the relative path with a variable.


### Usage in frontend JavaScript

This pug loader resolve all paths and aliases in Pug templates required from JavaScript.

For example, see the file structure of the application above, the pug template can be loaded in JavaScript via require().
The result of require() is a template function, where the argument is an object of `variableName:value`, which are available in the pug template.

File `./src/js/script.js`:
```js
// 'Templates' is webpack alias
// 'widgetTemplate' is template function
const widgetTemplate = require('Templates/widget.pug');

// variables passed to the pug template
const locals = {
  text: 'Hello World!',
  colors: [
    {
      "name": "red",
      "hex": "#f00"
    },
    {
      "name": "green",
      "hex": "#0f0"
    },
    {
      "name": "blue",
      "hex": "#00f"
    }
  ]
}

// render template function with variables to HTML
const html = widgetTemplate(locals);

console.log(html);

```

File `./src/templates/widget.pug`:

```pug
//- 'Templates' is webpack alias
include ~Templates/mixins

h2 Pug demo widget
//- the variables 'text' and `colors` are passed from 'script.js'
+widget(text, colors)
```

File `./src/templates/mixins.pug`:

```pug
mixin widget(text, colors)
  .widget
    p= text
    each color in colors
      div(style=`color:${color.hex};`)= color.name
```

The result of `console.log(html)`:
```html
<h2>Pug demo widget</h2>
<div class='widget'>
  <p>Hello World!</p>
  <div style="color:#f00">red</div>
  <div style="color:#0f0">green</div>
  <div style="color:#00f">blue</div>
</div>
```
