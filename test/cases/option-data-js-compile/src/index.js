// mode compile via loader option
const tmpl = require('Views/widget.pug?{"a":10,"b":"abc"}');
// mode render via query parameter
const html = require('Views/widget.pug?render&{"a":20,"b":"def"}');

console.log(tmpl());
console.log(html);