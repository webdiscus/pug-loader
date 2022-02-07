const tmpl = require('Template/widget.pug');

console.log(tmpl({
  data: {
    items: {
      a: 123,
      b: 'abc'
    }
  }
}));