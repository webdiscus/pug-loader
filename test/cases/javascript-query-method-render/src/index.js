// require with alias 'Views'
const html = require('Views/widget.pug?render&{"a":10,"b":"abc"}');

console.log(html);