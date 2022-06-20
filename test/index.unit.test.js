import { getQueryData } from '../src/utils';

describe('parse resource data', () => {
  it('empty string', () => {
    const expected = {};
    const received = getQueryData('');
    expect(received).toEqual(expected);
  });

  it('?', () => {
    const expected = {};
    const received = getQueryData('?');
    expect(received).toEqual(expected);
  });

  it('?pug-method', () => {
    const expected = {
      'pug-method': '',
    };
    const received = getQueryData('?pug-method');
    expect(received).toEqual(expected);
  });

  it('?pug-method=', () => {
    const expected = {
      'pug-method': '',
    };
    const received = getQueryData('?pug-method=');
    expect(received).toEqual(expected);
  });

  it('?pug-method=&', () => {
    const expected = {
      'pug-method': '',
    };
    const received = getQueryData('?pug-method=&');
    expect(received).toEqual(expected);
  });

  it('?pug-method=render', () => {
    const expected = {
      'pug-method': 'render',
    };
    const received = getQueryData('?pug-method=render');
    expect(received).toEqual(expected);
  });

  it('?pug-method=render&', () => {
    const expected = {
      'pug-method': 'render',
    };
    const received = getQueryData('?pug-method=render&');
    expect(received).toEqual(expected);
  });

  it('?{"a":10,"b":"abc"}', () => {
    const expected = {
      a: 10,
      b: 'abc',
    };
    const received = getQueryData('?{"a":10,"b":"abc"}');
    expect(received).toEqual(expected);
  });

  it('?&{"a":10,"b":"abc"}', () => {
    const expected = {
      a: 10,
      b: 'abc',
    };
    const received = getQueryData('?&{"a":10,"b":"abc"}');
    expect(received).toEqual(expected);
  });

  it('?pug-method=render&{"a":10,"b":"abc"}', () => {
    const expected = {
      'pug-method': 'render',
      a: 10,
      b: 'abc',
    };
    const received = getQueryData('?pug-method=render&{"a":10,"b":"abc"}');
    expect(received).toEqual(expected);
  });

  it('?pug-method=render&opts={"a":10,"b":"abc"}', () => {
    const expected = {
      'pug-method': 'render',
      options: { a: 10, b: 'abc' },
    };
    const received = getQueryData('?pug-method=render&options={"a":10,"b":"abc"}');
    expect(received).toEqual(expected);
  });

  it('?pug-method=render&opts[]=a1&opts[]=a2', () => {
    const expected = {
      'pug-method': 'render',
      args: ['a1', 'a2'],
    };
    const received = getQueryData('?pug-method=render&args[]=a1&args[]=a2');
    expect(received).toEqual(expected);
  });
});