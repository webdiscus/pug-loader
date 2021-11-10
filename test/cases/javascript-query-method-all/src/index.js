// require with alias 'Template'

// render HTML at runtime
const tmpl = require('Template/widget.pug?pug-compile');
const html1 = tmpl({ a: 10, b: 'abc' });

// render HTML at compile time
const html2 = require('Template/widget.pug?pug-render&{"a":20,"b":"def"}');
const html3 = require('Template/widget.pug?pug-render&{"a":30,"b":"qwe"}');

console.log(html1 + html2 + html3);