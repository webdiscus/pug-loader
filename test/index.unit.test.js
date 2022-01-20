import { getResourceParams } from '../src/utils';
import replaceAll from '../src/polyfills/string.replaceAll';

describe('self tests', () => {
  it('test it self', (done) => {
    expect(1).toEqual(1);
    done();
  });
});

describe('polyfill replaceAll', () => {
  it('replaceAll(str, newStr)', (done) => {
    const str = 'a und a';
    const expected = 'b und b';
    const received = replaceAll(str, 'a', 'b');
    expect(received).toEqual(expected);
    done();
  });

  it('replaceAll(str, callback)', (done) => {
    const str = 'a und a';
    const expected = '`a` und `a`';
    const received = replaceAll(str, 'a', (str) => '`' + str + '`');
    expect(received).toEqual(expected);
    done();
  });

  it('replaceAll(str, callback2)', (done) => {
    const str = 'begin a und a end';
    const expected = 'begin-a-und-a-end';
    const received = replaceAll(str, ' ', (str) => '-');
    expect(received).toEqual(expected);
    done();
  });

  it('replaceAll(str, callback3)', (done) => {
    const str = `[{data: require('./file1.js'),},{data: require('./file2.js'),}]`;
    const expected = `[{data: __sources__['./file1.js'],},{data: __sources__['./file2.js'],}]`;
    const received = replaceAll(str, /(require\(.+?\))/g, (value) => {
      const [, sourcePath] = /(?<=require\("|'|`)(.+)(?="|'|`\))/.exec(value) || [];
      return `__sources__['${sourcePath}']`;
    });
    expect(received).toEqual(expected);
    done();
  });

  it('replaceAll(str, array) Exception', (done) => {
    const str = 'a und a';
    const expected = 'The replacement argument of replaceAll() must be a string or a function, but given: ["b"]';
    try {
      replaceAll(str, 'a', ['b']);
    } catch (error) {
      expect(error.toString()).toContain(expected);
    }
    done();
  });
});

describe('parse resource data', () => {
  it('empty string', () => {
    const expected = {};
    const received = getResourceParams('');
    expect(received).toEqual(expected);
  });

  it('?', () => {
    const expected = {};
    const received = getResourceParams('?');
    expect(received).toEqual(expected);
  });

  it('?pug-method', () => {
    const expected = {
      'pug-method': '',
    };
    const received = getResourceParams('?pug-method');
    expect(received).toEqual(expected);
  });

  it('?pug-method=', () => {
    const expected = {
      'pug-method': '',
    };
    const received = getResourceParams('?pug-method=');
    expect(received).toEqual(expected);
  });

  it('?pug-method=&', () => {
    const expected = {
      'pug-method': '',
    };
    const received = getResourceParams('?pug-method=&');
    expect(received).toEqual(expected);
  });

  it('?pug-method=render', () => {
    const expected = {
      'pug-method': 'render',
    };
    const received = getResourceParams('?pug-method=render');
    expect(received).toEqual(expected);
  });

  it('?pug-method=render&', () => {
    const expected = {
      'pug-method': 'render',
    };
    const received = getResourceParams('?pug-method=render&');
    expect(received).toEqual(expected);
  });

  it('?{"a":10,"b":"abc"}', () => {
    const expected = {
      a: 10,
      b: 'abc',
    };
    const received = getResourceParams('?{"a":10,"b":"abc"}');
    expect(received).toEqual(expected);
  });

  it('?&{"a":10,"b":"abc"}', () => {
    const expected = {
      a: 10,
      b: 'abc',
    };
    const received = getResourceParams('?&{"a":10,"b":"abc"}');
    expect(received).toEqual(expected);
  });

  it('?pug-method=render&{"a":10,"b":"abc"}', () => {
    const expected = {
      'pug-method': 'render',
      a: 10,
      b: 'abc',
    };
    const received = getResourceParams('?pug-method=render&{"a":10,"b":"abc"}');
    expect(received).toEqual(expected);
  });

  it('?pug-method=render&opts={"a":10,"b":"abc"}', () => {
    const expected = {
      'pug-method': 'render',
      options: { a: 10, b: 'abc' },
    };
    const received = getResourceParams('?pug-method=render&options={"a":10,"b":"abc"}');
    expect(received).toEqual(expected);
  });

  it('?pug-method=render&opts[]=a1&opts[]=a2', () => {
    const expected = {
      'pug-method': 'render',
      args: ['a1', 'a2'],
    };
    const received = getResourceParams('?pug-method=render&args[]=a1&args[]=a2');
    expect(received).toEqual(expected);
  });
});