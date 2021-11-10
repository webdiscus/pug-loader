// require with alias 'Template'

// possible usages:
const tmpl = require('Template/widget.pug');
//const tmpl = require('Template/widget.pug?pug_compile');
//const tmpl = require('Template/widget.pug?pug_method=compile');

const title = 'Pug widget';
const text = 'Hello World!';

const output = tmpl({
  title: title,
  text: text,
});

console.log(output);