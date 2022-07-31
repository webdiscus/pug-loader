// require with alias 'Views'

const tmpl = require('Views/widget.pug');
const html = tmpl({
  a: 10,
  b: 'abc',
});

console.log(html);