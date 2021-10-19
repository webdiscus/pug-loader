[![npm version](https://badge.fury.io/js/@webdiscus/pug-loader.svg)](https://www.npmjs.com/package/@webdiscus/pug-loader)

# [pug-loader](https://www.npmjs.com/package/@webdiscus/pug-loader)

Webpack loader for the [Pug](https://pugjs.org) templates.\
This loader can be used to generate static HTML or javascript template function from Pug templates.

## Features
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
 
Why use this particular pug loader instead of the original one?
- the original `pugjs/pug-loader` is outdated and not supported more
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

The example of a webpack.config.js file:
```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// The absolute path to the base directory of application.
const basePath = path.resolve(__dirname);

// The minimal required options for pug-loader.
const pugLoaderOptions = {};

module.exports  = {
  resolve: {
    // the aliases used in pug templates
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
    // this plugin extract content of pug template and save compiled content to html file
    new HtmlWebpackPlugin({
      filename: path.join(basePath, '/src/templates/index.pug'),
      template: './public/index.html',
      inject: false
    }),
  ],

  module: {
    rules: [
      // the pug loader recive raw pug content from `HtmlWebpackPlugin`, 
      // compile to ´HTML´ and return compiled content back to `HtmlWebpackPlugin`
      {
        test: /\.pug$/,
        loader: 'webpack-pug-loader',
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
|     ├--index.jpeg
|     └--mixins.pug
└--webpack.config.js
```

The source Pug templates from `src/templates/` after compilation are saved as HTML in `public/`.

### Usage in Pug templates

File `./lib/components/ui/mixins.pug`

```pug
mixin show-colors(colors)
  each color in colors
    div(style=`background-color:${color.hex};`)= color.name

```

File `./lib/components/ui/layout.pug`
```
html
  head
    block head
  body
    block content
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

File `./src/templates/index.pug`

```pug
extends UIComponents/layout.pug
include UIComponents/mixins.pug

block content
  - const colors = require('UIComponents/colors.json')`
  
  .color-container
    +show-colors(colors)
  
```

In the sample above uses Webpack alias `UIComponents` instand of relative path `../../lib/components/ui/`.

### Usage embedded resources

For processing image resources in templates with webpack use the `require()` function:

```pug
div
  img(src=require('./my/image.jpeg'))
```

For usage embedded resources is need add an asset-module to configure `module.rules` in webpack.config.js:
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
Due to the peculiarities of the pug compiler, the formation of the file name
depends on the string and variable parts of argument in the `require()` function.\
Use a relative path only in the string before the variable.
The variable must contain ONLY the filename without specifying a path.

Correct usage example:
```pug
- filename = 'image.jpeg'
img(src=require('../relative/path/to/resource/', filename))
```
An example of dynamically generating embedded resources in template:
```pug
- files = ['image1.jpeg', 'image2.jpeg', 'image3.jpeg']
each file in files
  img(src=require('../images/' + file))
```

Example of webpack alias used in the table below: 
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
The result of require() is a template function, where the argument is a object of variableName:value, which are available in the pug template.

File `./src/js/script.js`:
```js
// 'Templates' is webpack alias
const tmpl = require('Templates/index.pug');
const text = 'Hello World!';

const output = tmpl({
  // pass the variable `text` into pug template
  text: text,
});

console.log(output);

```

File `./src/templates/index.pug`:

```pug
//- 'Templates' is webpack alias
include ~Templates/mixins

h2 Pug widget
//- the variable 'text' is passed from 'script.js'
+widget(text)
```

File `./src/templates/mixin.pug`:

```pug
mixin widget(text)
  .widget= text
```

The result of `console.log(output)`:
```html
<h2>Pug widget</h2><div class='widget'>Hello World!</div>
```
