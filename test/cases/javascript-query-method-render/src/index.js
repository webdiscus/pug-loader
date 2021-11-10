// require with alias 'Template'

// possible usages:
const output = require('Template/widget.pug?pug_render&{"a":10,"b":"abc"}');
//const output = require('Template/widget.pug?pug_render=true&{"a":10,"b":"abc"}');
//const output = require('Template/widget.pug?pug_method=render&{"a":10,"b":"abc"}');

console.log(output);