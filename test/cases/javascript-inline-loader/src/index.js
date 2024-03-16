// require with alias 'Views'

// usage inline a pug-loader in query, note: use it only if the pug-loader is not defined in webpack config
const tmpl = require('pug-loader!Views/widget.pug?compile&{"a":10,"b":"abc"}');
const html = tmpl();

const html2 = require('pug-loader!Views/widget.pug?render&{"a":20,"b":"def"}');

console.log(html + html2);