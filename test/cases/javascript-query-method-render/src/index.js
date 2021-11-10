// require with alias 'Template'
const html = require('Template/widget.pug?pug-render&{"a":10,"b":"abc"}');

console.log(html);