// require with alias 'Template'

const tmpl = require('Template/widget.pug');
const html = tmpl({
  a: 10,
  b: 'abc',
});

console.log(html);