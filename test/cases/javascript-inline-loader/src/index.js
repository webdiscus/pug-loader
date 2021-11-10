// require with alias 'Template'
// usage inline a pug-loader in query, note: use it only if the pug-loader is not defined in webpack config
//const output = require('../../../../src/index.js!Template/widget.pug?pug_render&{"a":10,"b":"abc"}');

const output = require('pug2-loader!Template/widget.pug?pug_compile&{"a":10,"b":"abc"}');

// ok
//const output = require('@webdiscus/pug-loader!Template/widget.pug?pug_render&{"a":10,"b":"abc"}');

console.log(output());