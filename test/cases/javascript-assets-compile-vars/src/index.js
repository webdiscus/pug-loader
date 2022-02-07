const tmpl = require('./views/page.pug');
const html = tmpl({
  _KEY_: 'item1',
  _OBJ_: {
    item1: 'AAA',
  },
  dataId: 'testData',
  testItems: {
    testData: {
      items: [
        // in pug will be passed to the function as `val` the value last item - `123`
        (val) => ('abc' + '_' + val),
        '123',
      ]
    }
  }
});

console.log(html);