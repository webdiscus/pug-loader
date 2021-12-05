const path = require('path');
const rimraf = require('rimraf');

import { copyRecursiveSync, readTextFileSync, execScriptSync } from './utils/file';
import { compile, compileTemplate } from './utils/webpack';

// The base path of test directory.
const basePath = path.resolve(__dirname, './');

const PATHS = {
  base: basePath,
  testSource: path.join(basePath, 'cases'),
  // absolute path of temp outputs for test
  testOutput: path.join(basePath, 'output'),
  // relative path in the test directory to web root dir name, same as by a web server (e.g. nginx)
  webRoot: '/public/',
  // relative path in the test directory to expected files for test
  expected: '/expected/',
  // relative path in the public directory
  output: '/assets/',
  assets: '/public/assets/',
};

beforeAll(() => {
  // delete all files from path
  rimraf.sync(PATHS.testOutput);
  // copy test files to temp directory
  copyRecursiveSync(PATHS.testSource, PATHS.testOutput);
});

beforeEach(() => {
  jest.setTimeout(5000);
});

describe('pug tests', () => {
  it('hello-world', (done) => {
    const relTestCasePath = 'hello-world',
      absTestPath = path.join(PATHS.testOutput, relTestCasePath);

    compile(PATHS, relTestCasePath, {}).then(() => {
      const received = readTextFileSync(path.join(absTestPath, PATHS.webRoot, 'index.html'));
      const expected = readTextFileSync(path.join(absTestPath, PATHS.expected, 'index.html'));
      expect(received).toEqual(expected);
      done();
    });
  });

  it('escape render', (done) => {
    const relTestCasePath = 'escape-render',
      absTestPath = path.join(PATHS.testOutput, relTestCasePath);

    compile(PATHS, relTestCasePath, {}).then(() => {
      const received = readTextFileSync(path.join(absTestPath, PATHS.webRoot, 'index.html'));
      const expected = readTextFileSync(path.join(absTestPath, PATHS.expected, 'index.html'));
      expect(received).toEqual(expected);
      done();
    });
  });
});

describe('extends, include require javascript', () => {
  it('include-script', (done) => {
    const relTestCasePath = 'include-script',
      absTestPath = path.join(PATHS.testOutput, relTestCasePath);

    compile(PATHS, relTestCasePath, {}).then(() => {
      const received = readTextFileSync(path.join(absTestPath, PATHS.webRoot, 'index.html'));
      const expected = readTextFileSync(path.join(absTestPath, PATHS.expected, 'index.html'));
      expect(received).toEqual(expected);
      done();
    });
  });

  it('extends-relative', (done) => {
    const relTestCasePath = 'extends-relative',
      absTestPath = path.join(PATHS.testOutput, relTestCasePath);

    compile(PATHS, relTestCasePath, {}).then(() => {
      const received = readTextFileSync(path.join(absTestPath, PATHS.webRoot, 'index.html'));
      const expected = readTextFileSync(path.join(absTestPath, PATHS.expected, 'index.html'));
      expect(received).toEqual(expected);
      done();
    });
  });

  it('include-relative', (done) => {
    const relTestCasePath = 'include-relative',
      absTestPath = path.join(PATHS.testOutput, relTestCasePath);

    compile(PATHS, relTestCasePath, {}).then(() => {
      const received = readTextFileSync(path.join(absTestPath, PATHS.webRoot, 'index.html'));
      const expected = readTextFileSync(path.join(absTestPath, PATHS.expected, 'index.html'));
      expect(received).toEqual(expected);
      done();
    });
  });

  it('require-relative', (done) => {
    const relTestCasePath = 'require-relative',
      absTestPath = path.join(PATHS.testOutput, relTestCasePath);

    compile(PATHS, relTestCasePath, {}).then(() => {
      const received = readTextFileSync(path.join(absTestPath, PATHS.webRoot, 'index.html'));
      const expected = readTextFileSync(path.join(absTestPath, PATHS.expected, 'index.html'));
      expect(received).toEqual(expected);
      done();
    });
  });

  it('extends-alias', (done) => {
    const relTestCasePath = 'extends-alias',
      absTestPath = path.join(PATHS.testOutput, relTestCasePath);

    compile(PATHS, relTestCasePath, {}).then(() => {
      const received = readTextFileSync(path.join(absTestPath, PATHS.webRoot, 'index.html'));
      const expected = readTextFileSync(path.join(absTestPath, PATHS.expected, 'index.html'));
      expect(received).toEqual(expected);
      done();
    });
  });

  it('include-alias', (done) => {
    const relTestCasePath = 'include-alias',
      absTestPath = path.join(PATHS.testOutput, relTestCasePath);

    compile(PATHS, relTestCasePath, {}).then(() => {
      const received = readTextFileSync(path.join(absTestPath, PATHS.webRoot, 'index.html'));
      const expected = readTextFileSync(path.join(absTestPath, PATHS.expected, 'index.html'));
      expect(received).toEqual(expected);
      done();
    });
  });

  it('require-alias', (done) => {
    const relTestCasePath = 'require-alias',
      absTestPath = path.join(PATHS.testOutput, relTestCasePath);

    compile(PATHS, relTestCasePath, {}).then(() => {
      const received = readTextFileSync(path.join(absTestPath, PATHS.webRoot, 'index.html'));
      const expected = readTextFileSync(path.join(absTestPath, PATHS.expected, 'index.html'));
      expect(received).toEqual(expected);
      done();
    });
  });
});

// Note: the pug template for each test case must be in separate directory,
// because when in template used a variable in require(),
// then will be loaded all other, not included, templates from current und sub directories.
describe('require embedded resources', () => {
  const relTestCasePath = 'require-embedded-resources';

  it('require-string', (done) => {
    const absTestPath = path.join(PATHS.testOutput, relTestCasePath),
      template = './src/includes/require-string/index.pug';

    compileTemplate(PATHS, relTestCasePath, template).then(() => {
      const received = readTextFileSync(path.join(absTestPath, PATHS.webRoot, 'index.html'));
      const expected = readTextFileSync(path.join(absTestPath, PATHS.expected, 'require-string.html'));
      expect(received).toEqual(expected);
      done();
    });
  });

  it('require-alias', (done) => {
    const absTestPath = path.join(PATHS.testOutput, relTestCasePath),
      template = './src/includes/require-alias/index.pug';

    compileTemplate(PATHS, relTestCasePath, template).then(() => {
      const received = readTextFileSync(path.join(absTestPath, PATHS.webRoot, 'index.html'));
      const expected = readTextFileSync(path.join(absTestPath, PATHS.expected, 'require-alias.html'));
      expect(received).toEqual(expected);
      done();
    });
  });

  it('require-include-mixin', (done) => {
    const absTestPath = path.join(PATHS.testOutput, relTestCasePath),
      template = './src/includes/require-include-mixin/index.pug';

    compileTemplate(PATHS, relTestCasePath, template).then(() => {
      const received = readTextFileSync(path.join(absTestPath, PATHS.webRoot, 'index.html'));
      const expected = readTextFileSync(path.join(absTestPath, PATHS.expected, 'require-include-mixin.html'));
      expect(received).toEqual(expected);
      done();
    });
  });

  it('require-variable-current-dir', (done) => {
    const absTestPath = path.join(PATHS.testOutput, relTestCasePath),
      template = './src/includes/require-variable-current-dir/index.pug';

    compileTemplate(PATHS, relTestCasePath, template).then(() => {
      const received = readTextFileSync(path.join(absTestPath, PATHS.webRoot, 'index.html'));
      const expected = readTextFileSync(path.join(absTestPath, PATHS.expected, 'require-variable-current-dir.html'));
      expect(received).toEqual(expected);
      done();
    });
  });

  it('require-variable-parent-dir', (done) => {
    const absTestPath = path.join(PATHS.testOutput, relTestCasePath),
      template = './src/includes/require-variable-parent-dir/index.pug';

    compileTemplate(PATHS, relTestCasePath, template).then(() => {
      const received = readTextFileSync(path.join(absTestPath, PATHS.webRoot, 'index.html'));
      const expected = readTextFileSync(path.join(absTestPath, PATHS.expected, 'require-variable-parent-dir.html'));
      expect(received).toEqual(expected);
      done();
    });
  });

  it('require-variable-sub-dir', (done) => {
    const absTestPath = path.join(PATHS.testOutput, relTestCasePath),
      template = './src/includes/require-variable-sub-dir/index.pug';

    compileTemplate(PATHS, relTestCasePath, template).then(() => {
      const received = readTextFileSync(path.join(absTestPath, PATHS.webRoot, 'index.html'));
      const expected = readTextFileSync(path.join(absTestPath, PATHS.expected, 'require-variable-sub-dir.html'));
      expect(received).toEqual(expected);
      done();
    });
  });
});

describe('require pug in javascript', () => {
  it(`options.method default`, (done) => {
    const relTestCasePath = 'javascript-option-method-default',
      absTestPath = path.join(PATHS.testOutput, relTestCasePath);

    compile(PATHS, relTestCasePath).then(() => {
      const received = execScriptSync(path.join(absTestPath, PATHS.assets, 'index.js'));
      const expected = readTextFileSync(path.join(absTestPath, PATHS.expected, 'output.html'));

      expect(received).toEqual(expected);
      done();
    });
  });

  it(`options.method=render`, (done) => {
    const relTestCasePath = 'javascript-option-method-render',
      absTestPath = path.join(PATHS.testOutput, relTestCasePath);

    compile(PATHS, relTestCasePath).then(() => {
      const received = execScriptSync(path.join(absTestPath, PATHS.assets, 'index.js'));
      const expected = readTextFileSync(path.join(absTestPath, PATHS.expected, 'output.html'));

      expect(received).toEqual(expected);
      done();
    });
  });

  it(`options.method=rtRender`, (done) => {
    const relTestCasePath = 'javascript-option-method-rtrender',
      absTestPath = path.join(PATHS.testOutput, relTestCasePath);

    compile(PATHS, relTestCasePath).then(() => {
      const received = execScriptSync(path.join(absTestPath, PATHS.assets, 'index.js'));
      const expected = readTextFileSync(path.join(absTestPath, PATHS.expected, 'output.html'));

      expect(received).toEqual(expected);
      done();
    });
  });

  it(`options.method=html`, (done) => {
    const relTestCasePath = 'javascript-option-method-html',
      absTestPath = path.join(PATHS.testOutput, relTestCasePath);

    compile(PATHS, relTestCasePath).then(() => {
      const received = execScriptSync(path.join(absTestPath, PATHS.assets, 'index.js'));
      const expected = readTextFileSync(path.join(absTestPath, PATHS.expected, 'output.html'));

      expect(received).toEqual(expected);
      done();
    });
  });

  it(`query method compile`, (done) => {
    const relTestCasePath = 'javascript-query-method-compile',
      absTestPath = path.join(PATHS.testOutput, relTestCasePath);

    compile(PATHS, relTestCasePath).then(() => {
      const received = execScriptSync(path.join(absTestPath, PATHS.assets, 'index.js'));
      const expected = readTextFileSync(path.join(absTestPath, PATHS.expected, 'output.html'));

      expect(received).toEqual(expected);
      done();
    });
  });

  it(`query method render`, (done) => {
    const relTestCasePath = 'javascript-query-method-render',
      absTestPath = path.join(PATHS.testOutput, relTestCasePath);

    compile(PATHS, relTestCasePath).then(() => {
      const received = execScriptSync(path.join(absTestPath, PATHS.assets, 'index.js'));
      const expected = readTextFileSync(path.join(absTestPath, PATHS.expected, 'output.html'));

      expect(received).toEqual(expected);
      done();
    });
  });

  it(`query methods compile and render`, (done) => {
    const relTestCasePath = 'javascript-query-method-all',
      absTestPath = path.join(PATHS.testOutput, relTestCasePath);

    compile(PATHS, relTestCasePath).then(() => {
      const received = execScriptSync(path.join(absTestPath, PATHS.assets, 'index.js'));
      const expected = readTextFileSync(path.join(absTestPath, PATHS.expected, 'output.html'));

      expect(received).toEqual(expected);
      done();
    });
  });

  it(`options.data for render`, (done) => {
    const relTestCasePath = 'javascript-option-data-render',
      absTestPath = path.join(PATHS.testOutput, relTestCasePath);

    compile(PATHS, relTestCasePath).then(() => {
      const received = execScriptSync(path.join(absTestPath, PATHS.assets, 'index.js'));
      const expected = readTextFileSync(path.join(absTestPath, PATHS.expected, 'output.html'));

      expect(received).toEqual(expected);
      done();
    });
  });

  it(`pug-loader in resource query`, (done) => {
    const relTestCasePath = 'javascript-inline-loader',
      absTestPath = path.join(PATHS.testOutput, relTestCasePath);

    compile(PATHS, relTestCasePath).then(() => {
      const received = execScriptSync(path.join(absTestPath, PATHS.assets, 'index.js'));
      const expected = readTextFileSync(path.join(absTestPath, PATHS.expected, 'output.html'));

      expect(received).toEqual(expected);
      done();
    });
  });

  it(`javascript assets compile`, (done) => {
    const relTestCasePath = 'javascript-assets-compile',
      absTestPath = path.join(PATHS.testOutput, relTestCasePath);

    compile(PATHS, relTestCasePath).then(() => {
      const received = execScriptSync(path.join(absTestPath, PATHS.assets, 'index.js'));
      const expected = readTextFileSync(path.join(absTestPath, PATHS.expected, 'output.html'));

      expect(received).toEqual(expected);
      done();
    });
  });

  it(`javascript assets render`, (done) => {
    const relTestCasePath = 'javascript-assets-render',
      absTestPath = path.join(PATHS.testOutput, relTestCasePath);

    compile(PATHS, relTestCasePath).then(() => {
      const received = execScriptSync(path.join(absTestPath, PATHS.assets, 'index.js'));
      const expected = readTextFileSync(path.join(absTestPath, PATHS.expected, 'output.html'));

      expect(received).toEqual(expected);
      done();
    });
  });

  it(`javascript assets html`, (done) => {
    const relTestCasePath = 'javascript-assets-html',
      absTestPath = path.join(PATHS.testOutput, relTestCasePath);

    compile(PATHS, relTestCasePath).then(() => {
      const received = execScriptSync(path.join(absTestPath, PATHS.assets, 'index.js'));
      const expected = readTextFileSync(path.join(absTestPath, PATHS.expected, 'output.html'));

      expect(received).toEqual(expected);
      done();
    });
  });

  it(`javascript esModule=false require`, (done) => {
    const relTestCasePath = 'javascript-esmodule-false-require',
      absTestPath = path.join(PATHS.testOutput, relTestCasePath);

    compile(PATHS, relTestCasePath).then(() => {
      const received = execScriptSync(path.join(absTestPath, PATHS.assets, 'index.js'));
      const expected = readTextFileSync(path.join(absTestPath, PATHS.expected, 'output.html'));

      expect(received).toEqual(expected);
      done();
    });
  });

  it(`javascript esModule=true import`, (done) => {
    const relTestCasePath = 'javascript-esmodule-true-import',
      absTestPath = path.join(PATHS.testOutput, relTestCasePath);

    compile(PATHS, relTestCasePath).then(() => {
      const received = execScriptSync(path.join(absTestPath, PATHS.assets, 'index.js'));
      const expected = readTextFileSync(path.join(absTestPath, PATHS.expected, 'output.html'));

      expect(received).toEqual(expected);
      done();
    });
  });
});

describe('exception tests', () => {
  test('exception: pug compile', (done) => {
    const relTestCasePath = 'exception-pug-compile';
    compile(PATHS, relTestCasePath, {})
      .then(() => {
        throw new Error('the test should throw an error');
      })
      .catch((error) => {
        expect(error.toString()).toContain(`Pug compilation failed.`);
        done();
      });
  });
});