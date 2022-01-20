[![npm](https://img.shields.io/npm/v/@webdiscus/pug-loader?logo=npm&color=brightgreen "npm package")](https://www.npmjs.com/package/@webdiscus/pug-loader "download npm package")
[![node](https://img.shields.io/node/v/@webdiscus/pug-loader)](https://nodejs.org)
[![node](https://img.shields.io/github/package-json/dependency-version/webdiscus/pug-loader/peer/webpack)](https://webpack.js.org/)
[![node](https://img.shields.io/github/package-json/dependency-version/webdiscus/pug-loader/peer/pug)](https://github.com/pugjs/pug)
[![codecov](https://codecov.io/gh/webdiscus/pug-loader/branch/master/graph/badge.svg?token=457T2BK3YN)](https://codecov.io/gh/webdiscus/pug-loader)
[![node](https://img.shields.io/npm/dm/@webdiscus/pug-loader)](https://www.npmjs.com/package/@webdiscus/pug-loader)

# [pug-loader](https://www.npmjs.com/package/@webdiscus/pug-loader)

Webpack loader for the [Pug](https://pugjs.org) templates.\
The pug loader resolves paths and webpack aliases for `extends`/`include`/`require()` in a pug template and compiles it to HTML or to a template function.

> **NEW:** The `pug-loader` is now the part of the [pug-plugin](https://github.com/webdiscus/pug-plugin).
> This plugin extracts HTML from the `pug` files defined in the webpack entry and save them in the output directory.
> Now is possible define `pug` files directly in `webpack entry`. [See usage examples](https://github.com/webdiscus/pug-plugin#usage-examples). 

## Features
 - supports for **Webpack 5** and **Pug 3**
 - supports for features and options of original [`pugjs/pug-loader`](https://github.com/pugjs/pug-loader/)
 - many time faster than original `pugjs/pug-loader`
 - supports for Webpack `resolve.alias` and `resolve.plugins`, works with and without the prefixes `~` `@`
 - supports for the path resolving from `tsconfig.json` using [`tsconfig-paths-webpack-plugin`](https://github.com/dividab/tsconfig-paths-webpack-plugin)
 - supports for the integration with `Angular Component`
 - supports for the syntax of `CommonJS` and `ES modules` in generated templates for loading them via `require` or `import`
 - compiling a pug into a template function, e.g. using in javascript:
   ```js
   const tmpl = require('template.pug');
   const html = tmpl({ key: "value" })
   ```
 - rendering a pug into HTML at compile time (using loader method `'render'` or query parameter `?pug-render`), e.g. using in javascript:
   ```js
   const html = require('template.pug?pug-render');
   ```
 - resolving the attribute `srcset` in `img` tag:
   ```pug
   img(srcset=`${require('./image1.jpeg')} 320w, ${require('./image2.jpeg')} 640w` src=require('./image.jpeg'))
   ```
   output
   ```html
   <img srcset="/assets/image1.f78b30f4.jpeg 320w, /assets/image2.f78b30f4.jpeg 640w" src="/assets/image.f78b30f4.jpeg">
   ```
 - use the `require()` for CommonJS and JSON files in pug templates, e.g.: \
    `data.json`
    ```json
    [
      { "id": 1, "name": "abc" },
      { "id": 2, "name": "xyz" }
    ]
    ```
    `say-hello.js`
    ```js
    module.exports = function (name) {
      return `Hello ${name}!`;
    }
    ```
    `pug template`
    ```pug
    - var sayHello = require('./say-hello')
    h1 #{ sayHello('pug') }
   
    - var myData = require('./data.json')
    each item in myData
      div #{item.id} #{item.name}
    ```
 - rendering to pure HTML using method `'html'` to handle HTML in additional loaders, e.g. in `html-loader`
 - passing custom data to templates at compile time using the loader option `data`, e.g.:
   ```js
   {
     test: /\.pug$/,
     loader: 'pug-loader',
     options: {
       method: 'render',
       data: { "key": "value" }
     }
   },
   ```
   or via query parameters:
   ```js
   const html = require('template.pug?pug-render&{"key":"value"}');
   ```
 - supports for the watching of changes in all dependencies
 - all features have integration [tests](https://github.com/webdiscus/pug-loader/blob/master/test/index.test.js) processed through a webpack runner
 
**Why use this particular pug loader instead of the original one?**
- the original `pugjs/pug-loader` is outdated and not maintained more
- the original `pugjs/pug-loader` has error by `npm install` [see issue](https://github.com/pugjs/pug-loader/issues/126): 
  - `npm ERR! Found: pug@3.0.2 ... pug-loader@2.4.0" has incorrect peer dependency "pug@^2.0.0"`
- this pug loader can render a pug into HTML without additional loader
- this pug loader resolve a path in an embedded resource
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
  // ...
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
For processing an embedded resource see [usage embedded resources](#usage-embedded-resources). 

> For rendering pug templates into static HTML is needed the [pug-plugin](https://github.com/webdiscus/pug-plugin).

The complete example of the webpack config file:

```js
const path = require('path');
const PugPlugin = require('pug-plugin');
// The absolute path to the base directory of application.
const basePath = path.resolve(__dirname);

// Default pug-loader options.
const pugLoaderOptions = {
  method: 'compile',
  esModule: false,
};‚

module.exports  = {
  resolve: {
    // aliases used in the code examples below
    alias: {
      Components: path.join(basePath, 'src/lib/components/ui/'),
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

  output: {
    path: path.join(basePath, 'public/'), // output path
    publicPath: '/',
    filename: '[name].js',
  },
  
  entry: {
    // the script used a pug template
    'script': './src/js/script.js',
    // save HTML into output.path as index.html
    'index': 'src/templates/index.pug',
  },

  plugins: [
    // this plugin extract HTML from pug template defined in webpack entry
    new PugPlugin(),
  ],

  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: 'pug-loader',
        options: pugLoaderOptions
      },
      
      // processing an embedded resource, e.g. img(src=require('./image.jpeg')) 
      {
        test: /\.(png|jpg|jpeg)/,
        type: 'asset/resource'
        generator: {
          filename: 'assets/images/[name]-[hash][ext][query]',
        },
      }
    ]
  }
};
```

<a id="options" name="options" href="#options"></a>
## Options of original pug-loader

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


## Additional options of this implementation

### `method`
Type: `string`<br>
Default: `compile`<br>
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
Type: `Boolean`<br>
Default: `false`<br>
Enable/disable ES modules syntax in generated JS modules. \
Values:
 - `true` The `pug-loader` generates JS modules with the ES modules syntax. \
   For example: `import html from 'template.pug';`. \
   For smaller and faster JS code, it is recommended to use this mode.
 - `false` defaults. The `pug-loader` generates JS modules with the CommonJS modules syntax. \
   For example, `const html = require('template.pug')`. \
   The default value is `false` for compatibility with the JS modules that is generated by the original pug-loader.
 
> **Note:** The option `esModule` is irrelevant for the  `html` method, because it returns a pure HTML string.

> For generates smaller and faster JS code, it is recommended to use this options:
> ```js
> {
>   method: 'render',
>   esModule: true
> }
> 
> ```

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
// 'Components' is the webpack alias for 'src/lib/components/ui/'
extends Components/layout.pug
include Components/mixins.pug

block content
  - const colors = require('Components/colors.json')`
  
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

In the sample above uses Webpack alias `Components` instand of relative path `../../lib/components/ui/`.

<a id="usage-in-javascript" name="usage-in-javascript" href="#usage-in-javascript"></a>
## Usage in JavaScript

This pug loader resolve all paths and aliases in Pug templates required from JavaScript.

For example, see the file structure of the application above, the pug template can be loaded in JavaScript via require().
The result of require() is a template function, where the argument is an object of `variableName:value`, which are available in the pug template.

File `./src/js/script.js`:
```js
// 'Templates' is the webpack alias for 'src/templates/'
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

See [the simple web app example](https://github.com/webdiscus/pug-loader/tree/master/examples/webpack-app-hello-pug/).

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
In JavaScript, the result of require () is a template function. Call the template function with some variables to render it то HTML:
```js
const tmpl = require('template.pug');
const html = tmpl({ key: 'value' }); // the HTML string
```
You can apply the method `render` to single template using the query parameter `?pug-render`:
```js
const html = require('template.pug?pug-render&{"key":"value"}'); // the HTML string
```
> **Note:** if the query parameter `pug-render` is set, then will be used rendering for this template, independent of the loader option `method`.
> Variables passed in template with method `render` will be used at compile time.

<a id="method-render" name="method-render" href="#method-render"></a>
### **Method** `render`
This method will render the pug into HTML at compile time. \
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
In JavaScript the result of require() is an HTML string:
```js
const html = require('template.pug'); // the HTML string
```

<a id="method-html" name="method-html" href="#method-html"></a>
### **Method** `html`

This method will render the pug to pure HTML and should be used with an additional loader to handle HTML. \
In webpack config add to `module.rules`:
```js
{
   test: /\.pug$/,
   use: [
     { 
       loader: 'html-loader',
       options: {
         esModule: false, // allow to use the require() for load a templqte in JavaScript
       },
     },
     {
       loader: 'pug-loader',
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
// render into HTML, because loader option 'method' is 'render'
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

      // processing an embedded resource by webpack
      {
        test: /\.(png|jpg|jpeg)/,
        type: '`asset/resource`',
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

See [the source files of this example](https://github.com/webdiscus/pug-loader/tree/master/examples/angular-component-render/).


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

      // processing an embedded resource by webpack
      {
        test: /\.(png|jpg|jpeg)/,
        type: 'asset/resource',
      },
    ],
  },
};

```

See [the source files of this example](https://github.com/webdiscus/pug-loader/tree/master/examples/angular-component-html/).


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

But how pass variables in template which is rendered into HTML?
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

To handles embedded resources in pug is needed the webpack module `asset/resource`:
```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg)/,
        type: 'asset/resource'
      },
      // ...
    ]
  },
};
```
More information about asset-modules [see here](https://webpack.js.org/guides/asset-modules/).

The example of dynamically generating embedded resources in template:
```pug
- files = ['image1.jpeg', 'image2.jpeg', 'image3.jpeg']
each file in files
  img(src=require(file))
```

### File resolving examples

The example of webpack alias used in the table below:
```
resolve: {
  alias: {
    Images: path.join(__dirname, 'src/images/'),
  },
}
```

| Code                                                                                                                                         | @webdiscus/pug-loader                   | pugjs/pug-loader                        |
|----------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------|-----------------------------------------|
| `img(src=require('image.jpeg'))`                                                                                                             | <span style="color:green">**OK**</span> | <span style="color:red">fail</span>     |
| `img(src=require('./image.jpeg'))`                                                                                                           | <span style="color:green">**OK**</span> | <span style="color:green">**OK**</span> |
| `img(src=require('./images/image.jpeg'))`                                                                                                    | <span style="color:green">**OK**</span> | <span style="color:green">**OK**</span> |
| `img(src=require('../images/image.jpeg'))`                                                                                                   | <span style="color:green">**OK**</span> | <span style="color:green">**OK**</span> |
| `img(src=require('Images/image.jpeg'))`                                                                                                      | <span style="color:green">**OK**</span> | <span style="color:green">**OK**</span> |
| `- var file = 'image.jpeg'`<br>`img(src=require('Images/' + file))`                                                                          | <span style="color:green">**OK**</span> | <span style="color:green">**OK**</span> |
| `- var file = 'image.jpeg'`<br>``img(src=require(`Images/${file}`))``                                                                        | <span style="color:green">**OK**</span> | <span style="color:green">**OK**</span> |
| `- var file = 'image.jpeg'`<br>`img(src=require(file))`                                                                                      | <span style="color:green">**OK**</span> | <span style="color:red">fail</span>     |
| `- var file = 'image.jpeg'`<br> ``img(src=require(`${file}`))``                                                                              | <span style="color:green">**OK**</span> | <span style="color:red">fail</span>     |
| `- var file = 'image.jpeg'`<br>`img(src=require('./' + file))`                                                                               | <span style="color:green">**OK**</span> | <span style="color:green">**OK**</span> |
| `- var file = './image.jpeg'`<br>`img(src=require(file))`                                                                                    | <span style="color:green">**OK**</span> | <span style="color:red">fail</span>     |
| `- var file = './image.jpeg'`<br>`img(src=require('' + file))`                                                                               | <span style="color:green">**OK**</span> | <span style="color:green">**OK**</span> |
| `- var file = 'images/image.jpeg'`<br>`img(src=require(file))`                                                                               | <span style="color:green">**OK**</span> | <span style="color:red">fail</span>     |
| `- var file = 'image.jpeg'`<br>`img(src=require('./images/' + file))`                                                                        | <span style="color:green">**OK**</span> | <span style="color:green">**OK**</span> |
| `- var file = 'image.jpeg'`<br>``img(src=require(`./images/${file}`))``                                                                      | <span style="color:green">**OK**</span> | <span style="color:green">**OK**</span> |
| `- var file = '../images/image.jpeg'`<br>`img(src=require(file))`                                                                            | <span style="color:green">**OK**</span> | <span style="color:red">fail</span>     |
| `- var file = 'image.jpeg'`<br>`img(src=require('../images/' + file))`                                                                       | <span style="color:green">**OK**</span> | <span style="color:green">**OK**</span> |
| `- var file = 'image.jpeg'`<br>``img(src=require(`../images/${file}`))``                                                                     | <span style="color:green">**OK**</span> | <span style="color:green">**OK**</span> |
| the `pugjs/pug-loader` can't resolve when used a mixin and require on same file: <br> `include mixins`<br>`img(src=require('./image.jpeg'))` | <span style="color:green">**OK**</span> | <span style="color:red">fail</span>     |

---
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

## Testing

`npm run test` will run the unit and integration tests.\
`npm run test:coverage` will run the tests with coverage.

## Also See

- more examples of usages see in [test cases](https://github.com/webdiscus/pug-loader/tree/master/test/cases)
- [`pug GitHub`][pug]
- [`pug API Reference`][pug-api]
- [`pug-plugin`][pug-plugin]

## License

[ISC](https://github.com/webdiscus/pug-loader/blob/master/LICENSE)

[pug]: https://github.com/pugjs/pug
[pug-api]: https://pugjs.org/api/reference.html
[pug-plugin]: https://github.com/webdiscus/pug-plugin
