// pass data into pug with `render` mode
const html = require('Templates/widget.pug?{"data":{"items":{"a":123,"b":"abc"}}}');

console.log(html);