// require with alias 'Template'

// possible usages:
//const output = require('Template/widget.pug?pug_compile&{"a":10,"b":"abc"}');

//const output = require('Template/widget.pug?pug_render&{"a":10,"b":"abc"}');
//const output = require('Template/widget.pug?pug_render');

//const output = require('apply-loader!Template/widget.pug?pug_compile');

//const output = require('pug-res-loader!Template/widget.pug?pug_compile'); // ok

//const output = require('Template/widget.pug?pug_compile'); // --
//const output = require('Template/widget.pug?pug_render=true&{"a":10,"b":"abc"}');
//const output = require('Template/widget.pug?pug_method=render&{"a":10,"b":"abc"}');

//const output = require('Template/widget.pug?{"a":10,"b":"abc"}'); // ok
//const output2 = require('Template/widget.pug'); // ok

// OK
//const output = require('pug-render!Template/widget.pug?{"a":10,"b":"abc"}'); // ok
//const output = require('pug-render!Template/widget.pug'); // ok
//console.log(output);
// ###

// OK
//const output = require('Template/widget.pug');
//console.log(output());
//console.log(output({ a: 20, b: 'def' }));
// ###

// OK
const html1 = require(`Template/widget.pug`);
const html2 = require(`Template/widget.pug?{"a":10,"b":"abc"}`);
const tmpl = require('Template/widget.pug?pug-compile&a=20');

console.log(html1 + html2 + tmpl({ b: 'xyz' }));