// method render via loader option
const html = require('Template/widget.pug?{"a":10,"b":"abc"}');
// method compile via query parameter
const tmpl = require('Template/widget.pug?pug-compile&{"a":20,"b":"def"}');

console.log(html);
console.log(tmpl());