// method compile via loader option
const tmpl = require('Template/widget.pug?{"a":10,"b":"abc"}');
// method render via query parameter
const html = require('Template/widget.pug?pug-render&{"a":20,"b":"def"}');

console.log(tmpl());
console.log(html);