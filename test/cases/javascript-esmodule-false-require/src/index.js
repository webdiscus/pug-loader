const html1 = require('Template/widget.pug');
const html2 = require('Template/widget.pug?{"a":10,"b":"xyz"}');
const html3 = require('Template/widget.pug?a=20&b=zzz');

console.log(html1 + html2 + html3);