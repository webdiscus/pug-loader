// require with alias 'Views'

// render HTML at runtime
const tmpl = require('Views/widget.pug?compile');
const html1 = tmpl({ a: 10, b: 'abc' });

// render HTML at compile time
const html2 = require('Views/widget.pug?render&{"a":20,"b":"def"}');
const html3 = require('Views/widget.pug?render&{"a":30,"b":"qwe"}');

console.log(html1 + html2 + html3);