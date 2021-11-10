// require with alias 'Template'

// possible usages:
const output1 = require('Template/widget.pug?{"a":10,"b":"abc"}');
const output2 = require('Template/widget.pug?pug_render&{"a":20,"b":"def"}');

console.log(output1 + output2);