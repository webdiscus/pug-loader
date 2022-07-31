// require with alias 'Views'

const tmpl = require('Views/widget.pug');
const html = tmpl({
  title: 'Pug widget',
  text: 'Hello World!',
});

console.log(html);