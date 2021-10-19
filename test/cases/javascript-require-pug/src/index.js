// require with alias 'Template'
const tmpl = require('Template/widget.pug');

const title = 'Pug widget';
const text = 'Hello World!';

const output = tmpl({
  title: title,
  text: text,
});

console.log(output);