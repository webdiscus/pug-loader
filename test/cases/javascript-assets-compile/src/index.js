const tmpl = require(`Template/widget.pug`);
const tmpl2 = require(`Template/widget.pug?{"a":10,"b":"abc"}`);
const html = require('Template/widget.pug?pug-render&a=20');

console.log(tmpl() + tmpl2({ b: 'xyz' }) + html);