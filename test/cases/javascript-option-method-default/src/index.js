// require with alias 'Template'

const tmpl = require('Template/widget.pug');
const html = tmpl({
  title: 'Pug widget',
  text: 'Hello World!',
});

console.log(html);