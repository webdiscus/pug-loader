import path from 'path';
import { readTextFileSync } from './utils/file';
import { getQueryData, trimIndent } from '../src/Utils';

const PATHS = {
  testSource: path.join(__dirname, 'cases'),
  // relative path in the test directory to expected files for test
  expected: '/expected/',
};

describe('parse resource data', () => {
  test('empty string', () => {
    const expected = {};
    const received = getQueryData('');
    expect(received).toEqual(expected);
  });

  test('?', () => {
    const expected = {};
    const received = getQueryData('?');
    expect(received).toEqual(expected);
  });

  test('?pug-method', () => {
    const expected = {
      'pug-method': '',
    };
    const received = getQueryData('?pug-method');
    expect(received).toEqual(expected);
  });

  test('?pug-method=', () => {
    const expected = {
      'pug-method': '',
    };
    const received = getQueryData('?pug-method=');
    expect(received).toEqual(expected);
  });

  test('?pug-method=&', () => {
    const expected = {
      'pug-method': '',
    };
    const received = getQueryData('?pug-method=&');
    expect(received).toEqual(expected);
  });

  test('?pug-method=render', () => {
    const expected = {
      'pug-method': 'render',
    };
    const received = getQueryData('?pug-method=render');
    expect(received).toEqual(expected);
  });

  test('?pug-method=render&', () => {
    const expected = {
      'pug-method': 'render',
    };
    const received = getQueryData('?pug-method=render&');
    expect(received).toEqual(expected);
  });

  test('?{"a":10,"b":"abc"}', () => {
    const expected = {
      a: 10,
      b: 'abc',
    };
    const received = getQueryData('?{"a":10,"b":"abc"}');
    expect(received).toEqual(expected);
  });

  test('?&{"a":10,"b":"abc"}', () => {
    const expected = {
      a: 10,
      b: 'abc',
    };
    const received = getQueryData('?&{"a":10,"b":"abc"}');
    expect(received).toEqual(expected);
  });

  test('?pug-method=render&{"a":10,"b":"abc"}', () => {
    const expected = {
      'pug-method': 'render',
      a: 10,
      b: 'abc',
    };
    const received = getQueryData('?pug-method=render&{"a":10,"b":"abc"}');
    expect(received).toEqual(expected);
  });

  test('?pug-method=render&opts={"a":10,"b":"abc"}', () => {
    const expected = {
      'pug-method': 'render',
      options: { a: 10, b: 'abc' },
    };
    const received = getQueryData('?pug-method=render&options={"a":10,"b":"abc"}');
    expect(received).toEqual(expected);
  });

  test('?pug-method=render&opts[]=a1&opts[]=a2', () => {
    const expected = {
      'pug-method': 'render',
      args: ['a1', 'a2'],
    };
    const received = getQueryData('?pug-method=render&args[]=a1&args[]=a2');
    expect(received).toEqual(expected);
  });
});

describe('remove indents in vue and react templates', () => {
  test('no indent', (done) => {
    const relTestCasePath = 'pug-remove-indent-unit';
    const receivedFile = 'no-indent.pug';

    const absTestPath = path.join(PATHS.testSource, relTestCasePath);
    const pug = readTextFileSync(path.join(absTestPath, 'src', receivedFile));
    const received = trimIndent(pug);
    const expected = false;

    expect(received).toEqual(expected);
    done();
  });

  test('indent-2-spaces 2nd-line', (done) => {
    const relTestCasePath = 'pug-remove-indent-unit';
    const receivedFile = 'indent-2-spaces/indent-2nd-line.pug';

    const absTestPath = path.join(PATHS.testSource, relTestCasePath);
    const pug = readTextFileSync(path.join(absTestPath, 'src', receivedFile));
    const received = trimIndent(pug);
    const expected = readTextFileSync(path.join(absTestPath, 'expected', receivedFile));

    expect(received).toEqual(expected);
    done();
  });

  test('indent-4-spaces 1st-line', (done) => {
    const relTestCasePath = 'pug-remove-indent-unit';
    const receivedFile = 'indent-4-spaces/indent-1st-line.pug';

    const absTestPath = path.join(PATHS.testSource, relTestCasePath);
    const pug = readTextFileSync(path.join(absTestPath, 'src', receivedFile));
    const received = trimIndent(pug);
    const expected = readTextFileSync(path.join(absTestPath, 'expected', receivedFile));

    expect(received).toEqual(expected);
    done();
  });

  test('indent-4-spaces 2nd-line', (done) => {
    const relTestCasePath = 'pug-remove-indent-unit';
    const receivedFile = 'indent-4-spaces/indent-2nd-line.pug';

    const absTestPath = path.join(PATHS.testSource, relTestCasePath);
    const pug = readTextFileSync(path.join(absTestPath, 'src', receivedFile));
    const received = trimIndent(pug);
    const expected = readTextFileSync(path.join(absTestPath, 'expected', receivedFile));

    expect(received).toEqual(expected);
    done();
  });

  test('indent-tabs 2nd-line', (done) => {
    const relTestCasePath = 'pug-remove-indent-unit';
    const receivedFile = 'indent-tabs/indent-2nd-line.pug';

    const absTestPath = path.join(PATHS.testSource, relTestCasePath);
    const pug = readTextFileSync(path.join(absTestPath, 'src', receivedFile));
    const received = trimIndent(pug);
    const expected = readTextFileSync(path.join(absTestPath, 'expected', receivedFile));

    expect(received).toEqual(expected);
    done();
  });
});