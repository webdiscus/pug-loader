// require with alias 'Template'

// possible usages:
const tmpl = require('Template/widget.pug');
//const tmpl = require('Template/widget.pug?pug_compile');
//const tmpl = require('Template/widget.pug?pug_method=compile');

const output = tmpl({
  a: 10,
  b: 'abc',
});

console.log(output);