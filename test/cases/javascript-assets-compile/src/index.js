const locals = {
  data: {
    items: {
      a: 123,
      b: 'abc',
    },
  },
};

const tmpl = require('Templates/widget.pug');
const html = tmpl(locals);

console.log(html);