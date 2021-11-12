[![npm version](https://badge.fury.io/js/@webdiscus%2Fpug-loader.svg)](https://badge.fury.io/js/@webdiscus%2Fpug-loader)

# [pug-loader](https://www.npmjs.com/package/@webdiscus/pug-loader)

Webpack loader for the [Pug](https://pugjs.org) templates.\
The `pug-loader` resolve paths and webpack aliases for `extends`/`include`/`require()` in pug template and compiles it into static HTML or into javascript template function.

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
 - compiling in JS a pug file into template function, e.g.:
   ```js
   const tmpl = require('template.pug');
   const html = tmpl({ var1: "value1" })
   ```
 - rendering in JS a pug file directly into HTML (using loader option `{method:'render'}` or query parameter `?pug-render`), e.g.:
   ```js
   const html = require('template.pug?pug-render&{var1:"value1"}');
   ```
 - support for passing custom data to templates at compile time using loader option or resource query parameters 
 - supports watching of changes in all dependencies
 - all features have integration [tests](https://github.com/webdiscus/pug-loader/blob/master/test/index.test.js) processed through a webpack runner
 
**Why use this particular pug loader instead of the original one?**
- the original `pugjs/pug-loader` is outdated and not maintained more
- the original `pugjs/pug-loader` has error by `npm install` [see issue](https://github.com/pugjs/pug-loader/issues/126): 
  - `npm ERR! Found: pug@3.0.2 ... pug-loader@2.4.0" has incorrect peer dependency "pug@^2.0.0"`
- this pug loader in JS can render a template directly in HTML, w/o usage an additional loader
- this pug loader support Webpack `resolve.alias` also without the prefix `~`
- this pug loader is many times faster than the original `pugjs/pug-loader`
- this pug loader watch all change in all dependencies

[Install](#install) \
[Webpack config](#webpack-config) \
[Options](#options) \
[Usage in Pug templates](#usage-in-pug-templates) \
[Usage in JavaScript](#usage-in-javascript) \
[Usage method `compile` in JavaScript](#method-compile) \
[Usage method `render` in JavaScript](#method-render) \
[Usage method `html` in JavaScript](#method-html) \
[Usage with Angular Component](#usage-with-angular-component) \
[Passing data into template](#passing-data-into-template) \
[Usage embedded resources](#usage-embedded-resources) \
[More examples of usages](https://github.com/webdiscus/pug-loader/tree/master/test/cases)


<a id="install" name="install" href="#install"></a>
## Install

```console
npm install @webdiscus/pug-loader --save-dev
```

<a id="webpack-config" name="webpack-config" href="#webpack-config"></a>
## Webpack config

For usage pug templates only in javascript is enough add to a webpack config:
```js
{
  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: '@webdiscus/pug-loader',
      }
    ]
  }
}
```

Or you can define the `resolveLoader.alias` to use the `pug-loader` as default pug loader name:
```js
{
  resolveLoader: {
    alias: {
      'pug-loader': '@webdiscus/pug-loader'
    }
  },
  ...
  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: 'pug-loader',
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
  
  resolveLoader: {
    // alias for pug-loader
    alias: {
      'pug-loader': '@webdiscus/pug-loader'
    }
  },
  
  entry: {
    // the script used a pug template
    'script': './src/js/script.js',
  },

  output: {
    path: path.join(basePath, 'public'),
    filename: '[name].js',
    assetModuleFilename: 'assets/images/[hash][ext][query]',
  },

  plugins: [
    // this plugin extract the content of a pug template 
    // and save compiled via pug-loader content into html file
    new HtmlWebpackPlugin({
      template: path.join(basePath, '/src/templates/index.pug'),
      filename: './public/index.html',
      inject: false
    }),
  ],

  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: 'pug-loader',
        options: pugLoaderOptions
      },
      // it is need for usage embedded resources in pug, like img(src=require('./image.jpeg')) 
      {
        test: /\.(png|jpg|jpeg)/,
        type: 'asset/resource'
      }
    ]
  }
};
```

<a id="options" name="options" href="#options"></a>
## Options of original pug-loader

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

## Additional options of this implementation

### `method`
Type: `string`<br>
Default: `compile`<br>
Values:
 - `compile` the pug template compiles into a template function and in JavaScript can be called to render with variables into HTML at runtime, [see usage >>](#method-compile)
 - `render` the pug template compiles into a template function and by require() in JavaScript will automatically render to HTML at runtime, [see usage >>](#method-render)
 - `html` the template renders directly into a pure HTML string at compile time, [see usage >>](#method-html)
 
> With methods `compile` and `render` an embedded resource such as `img(src=require('./image.jpeg'))` handles at compile time by the webpack using `asset/resource`.

> The method `html` need an additional loader, e.g. `html-loader`, to handle the HTML string and an embedded resource.<br>
> ⚠ **Limitation:** an embedded resource such as `img(src='./image.jpeg')` must be assigned in pug without `require()` function, otherwise appear error: `require() not found`.

### `data`
Type: `Object`<br>
Default: `{}`<br>
The custom data will be passed in all pug templates, it can be useful by pass global data.

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

<a id="usage-in-pug-templates" name="usage-in-pug-templates" href="#usage-in-pug-templates"></a>
## Usage in Pug templates

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
```pug
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

<a id="usage-in-javascript" name="usage-in-javascript" href="#usage-in-javascript"></a>
## Usage in JavaScript

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

[See the simple web app example >>](https://github.com/webdiscus/pug-loader/tree/master/samples/webpack-app-hello-pug/)

<a id="usage-in-pug-javascript" name="usage-in-pug-javascript" href="#usage-in-pug-javascript"></a>
## Usage methods `compile`, `render` or `html` in JavaScript

<a id="method-compile" name="method-compile" href="#method-compile"></a>
### Method `compile` (default)

In JavaScript the required template will be compiled into template function.\
In webpack config add to `module.rules`:
```js
{
  test: /\.pug$/,
  loader: 'pug-loader',
  options: {
    method: 'compile' // default method `compile` can be omitted
  }
}
```
In JavaScript the result of require() must be called with some variables to render the template into HTML:
```js
const tmpl = require('template.pug');
const html = tmpl({ key: 'value' });
```
Or add the query parameter `?pug-render` to render into HTML:
```js
const html = require('template.pug?pug-render');
```
**Note:** if the query parameter `pug-render` is set, then will be used rendering, independent of the loader option `method`.

<a id="method-render" name="method-render" href="#method-render"></a>
### **Method** `render`
Rendering into HTML. This method compile the pug into template function, but by require() it will be transformed into HTML. \
In webpack config add to `module.rules`:
```js
{
  test: /\.pug$/,
  loader: 'pug-loader',
  options: {
    method: 'render'
  }
}
```
In JavaScript can be used the result of require() as HTML string, automatically rendered at runtime:
```js
const html = require('template.pug');
```

<a id="method-html" name="method-html" href="#method-html"></a>
### **Method** `html`

Rendering directly into pure HTML. \
**Note:** additional loader `html-loader` is required. \
In webpack config add to `module.rules`:
```js
{
   test: /\.pug$/,
   use: [
     { 
       loader: 'html-loader',
       options: {
         esModule: false,
       },
     },
     {
       loader: 'pug-loader',
       options: {
         method: 'html',
       },
     },
   ],
},
// Process image resources with webpack
{
  test: /\.(png|jpg|jpeg)/,
  type: 'asset/resource',
},
```
In JavaScript the template will be directly rendered into HTML:
```js
const html = require('template.pug');
```
> ⚠ **Limitation:** an embedded resource must be assigned in pug without `require()` function:
> ```pug
> img(src='./assets/image.jpeg')
> ```


### Usage scenario 1: pug loader configured for compiling (defaults)

Webpack config:
```js
{
  test: /\.pug$/,
  loader: 'pug-loader'
}
```

JavaScript:
```js
// compile into template function, because loader option 'method' defaults is 'compile'
const tmpl = require('template.pug');
const html = tmpl({...});

// render the pug file into HTML, using the parameter 'pug-render'
const html2 = require('template2.pug?pug-render');
```

### Usage scenario 2: pug loader configured for rendering

Webpack config:
```js
{
  test: /\.pug$/,
  loader: 'pug-loader', 
  options: {
    method: 'render'
  }
}
```

JavaScript:
```js
// render directly into HTML, because loader option 'method' is 'render'
const html = require('template.pug');

// compile into template function, using the parameter 'pug-compile'
const tmpl2 = require('template2.pug?pug-compile');
const html2 = tmpl2({...});
```

<a id="usage-with-angular-component" name="usage-with-angular-component" href="#usage-with-angular-component"></a>
## Usage with Angular Component

For usage pug-loader with Angular is needed to customize the webpack config.

Install packages:
```
npm i --saveDev @webdiscus/pug-loader pug-plugin-ng
```
> in pug-loader can be used optional a plugin, e.g. [**pug-plugin-ng**](https://www.npmjs.com/package/pug-plugin-ng), to allow unquoted syntax of Angular: [(bananabox)]="val"

Create the file `webpack.config.js` in root directory of angular project:

```js
module.exports = {
  resolveLoader: {
    alias: {
      'pug-loader': '@webdiscus/pug-loader',
    },
  },

  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: 'pug-loader',
        options: {
          method: 'render',
          doctype: 'html',
          plugins: [require('pug-plugin-ng')],
        },
      },

      // Process image resources in pug templates with webpack
      {
        test: /\.(png|jpg|jpeg)/,
        type: 'asset/resource',
      },
    ],
  },
};
```
 
Bind the file `webpack.config.js` in the Angular config file `angular.json`:
```js
{
  ...
  "projects": {
      ...
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
            ...
          },
          ...
        },
        "serve": {
          // replace architect.serve.builder with this value:
          "builder": "@angular-builders/custom-webpack:dev-server",
          "options": {
            "browserTarget": "<app-name>:build"
          },
          ...
        },
        ...
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

[See the source files of this example >>](https://github.com/webdiscus/pug-loader/tree/master/samples/angular-component-render/)


### Alternative usage with additional `html-loader`

Install the `html-loader`:
```
npm i --saveDev html-loader
```

If your templates use the `html-loader`, then modify the `webpack.config.js` file:

```js
module.exports = {
  resolveLoader: {
    alias: {
      'pug-loader': '@webdiscus/pug-loader',
    },
  },

  module: {
    rules: [
      {
        test: /\.pug$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              esModule: false,
            },
          },
          {
            loader: 'pug-loader',
            options: {
              method: 'html', // the method render into HTML string and require additional loader `html-loader`
              doctype: 'html',
              plugins: [require('pug-plugin-ng')], // optional plugin 
            },
          },
        ],
      },

      // Process image resources in pug templates with webpack
      {
        test: /\.(png|jpg|jpeg)/,
        type: 'asset/resource',
      },
    ],
  },
};

```

[See the source files of this example >>](https://github.com/webdiscus/pug-loader/tree/master/samples/angular-component-html/)


<a id="passing-data-into-template" name="passing-data-into-template" href="#passing-data-into-template"></a>
## Passing data into template

By default, the pug file is compiled as template function, into which can be passed an object with template variables.
```js
const tmpl = require('template.pug');
const html = tmpl2({
   key: 'value',
   foo: 'bar',
});
```

But how pass variables in template which is directly rendered into HTML?
```js
const html = require('template.pug');
```
Variables can be passed with query parameters, e.g.:
```js
const html = require('template.pug?key=value&foo=bar');
```
or as a JSON object, e.g.:
```js
const html = require('template.pug?{"key":"value","foo":"bar"}');
```
Using the method `render` and JSON object:
```js
const html = require('template.pug?pug-render&{"key":"value","foo":"bar"}');
```

> Usage of query parameters is legal and [official documented](https://webpack.js.org/api/loaders/#thisresourcequery) feature of webpack loader.

To pass variables global, in all templates at compile time use loader option `data`:
```js
{
  test: /\.pug$/,
  loader: 'pug-loader',
  options: {
    data: {
      key: 'value',
      foo: 'bar'  
    }
  }
}
```
The variables will be passed in all templates independent of the method.


<a id="usage-embedded-resources" name="usage-embedded-resources" href="#usage-embedded-resources"></a>
## Usage embedded resources

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
Include the template from sub directory: <br> `include mixins`<br>``img(src=require('./image.jpeg'))``| <span style="color:green">**OK**</span> | <span style="color:red">fail</span> | when use a mixin and require on same file, then `pugjs/pug-loader` can't resolve the file in require().

---
More examples of usages see in [test cases](https://github.com/webdiscus/pug-loader/tree/master/test/cases).
> Important: in examples used name of loader as `pug-loader`, because it is defined as **alias** at resolveLoader:
> ```js
> {
>   resolveLoader: {
>     alias: {
>       'pug-loader': '@webdiscus/pug-loader'
>     }
>   },
> }
> ```

## License

[ISC](https://github.com/webdiscus/pug-loader/blob/master/LICENSE)
