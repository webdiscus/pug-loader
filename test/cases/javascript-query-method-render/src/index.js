// require with alias 'Views'
const html = require('Views/widget.pug?pug-render&{"a":10,"b":"abc"}');

console.log(html);