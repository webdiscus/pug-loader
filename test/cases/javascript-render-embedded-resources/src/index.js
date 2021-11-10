const html1 = require(`Template/widget.pug`);
const html2 = require(`Template/widget.pug?{"a":10,"b":"abc"}`);
const tmpl = require('Template/widget.pug?pug-compile&a=20');

console.log(html1 + html2 + tmpl({ b: 'xyz' }));