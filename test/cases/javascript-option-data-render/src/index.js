// require with alias 'Template'

const html1 = require('Template/widget.pug?{"a":10,"b":"abc"}');
const html2 = require('Template/widget.pug?pug-render&{"a":20,"b":"def"}');

console.log(html1 + html2);