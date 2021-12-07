const path = require('path');
const rimraf = require('rimraf');

import { copyRecursiveSync, readTextFileSync } from './utils/file';
import { compareContent, compareTemplateFunction, exceptionContain } from './utils/helpers';

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
    const relTestCasePath = 'hello-world';
    compareContent(PATHS, relTestCasePath, done);
  });

  it('escape render', (done) => {
    const relTestCasePath = 'escape-render';
    compareContent(PATHS, relTestCasePath, done);
  });
});

describe('extends, include require javascript', () => {
  it('include-alias', (done) => {
    const relTestCasePath = 'include-alias';
    compareContent(PATHS, relTestCasePath, done);
  });

  it('include-basedir', (done) => {
    const relTestCasePath = 'include-basedir';
    compareContent(PATHS, relTestCasePath, done);
  });

  it('include-relative', (done) => {
    const relTestCasePath = 'include-relative';
    compareContent(PATHS, relTestCasePath, done);
  });

  it('include-script', (done) => {
    const relTestCasePath = 'include-script';
    compareContent(PATHS, relTestCasePath, done);
  });

  it('extends-alias', (done) => {
    const relTestCasePath = 'extends-alias';
    compareContent(PATHS, relTestCasePath, done);
  });

  it('extends-relative', (done) => {
    const relTestCasePath = 'extends-relative';
    compareContent(PATHS, relTestCasePath, done);
  });

  it('require-json-alias', (done) => {
    const relTestCasePath = 'require-json-alias';
    compareContent(PATHS, relTestCasePath, done);
  });

  it('require-json-relative', (done) => {
    const relTestCasePath = 'require-json-relative';
    compareContent(PATHS, relTestCasePath, done);
  });
});

// Note: the pug template for each test case must be in separate directory,
// because when in template used a variable in require(),
// then will be loaded all other, not included, templates from current und sub directories.
describe('require embedded resources', () => {
  it('require-string', (done) => {
    const relTestCasePath = 'require-resource-string';
    compareContent(PATHS, relTestCasePath, done);
  });

  it('require-alias', (done) => {
    const relTestCasePath = 'require-resource-alias';
    compareContent(PATHS, relTestCasePath, done);
  });

  it('require-include-mixin', (done) => {
    const relTestCasePath = 'require-resource-include-mixin';
    compareContent(PATHS, relTestCasePath, done);
  });

  it('require-variable-current-dir', (done) => {
    const relTestCasePath = 'require-resource-variable-current-dir';
    compareContent(PATHS, relTestCasePath, done);
  });

  it('require-variable-parent-dir', (done) => {
    const relTestCasePath = 'require-resource-variable-parent-dir';
    compareContent(PATHS, relTestCasePath, done);
  });

  it('require-variable-sub-dir', (done) => {
    const relTestCasePath = 'require-resource-variable-sub-dir';
    compareContent(PATHS, relTestCasePath, done);
  });
});

describe('require pug in javascript', () => {
  it(`options.method default`, (done) => {
    const relTestCasePath = 'javascript-option-method-default';
    compareTemplateFunction(PATHS, relTestCasePath, done);
  });

  it(`options.method=render`, (done) => {
    const relTestCasePath = 'javascript-option-method-render';
    compareTemplateFunction(PATHS, relTestCasePath, done);
  });

  it(`options.method=rtRender`, (done) => {
    const relTestCasePath = 'javascript-option-method-rtrender';
    compareTemplateFunction(PATHS, relTestCasePath, done);
  });

  it(`options.method=html`, (done) => {
    const relTestCasePath = 'javascript-option-method-html';
    compareTemplateFunction(PATHS, relTestCasePath, done);
  });

  it(`query method compile`, (done) => {
    const relTestCasePath = 'javascript-query-method-compile';
    compareTemplateFunction(PATHS, relTestCasePath, done);
  });

  it(`query method render`, (done) => {
    const relTestCasePath = 'javascript-query-method-render';
    compareTemplateFunction(PATHS, relTestCasePath, done);
  });

  it(`query methods compile and render`, (done) => {
    const relTestCasePath = 'javascript-query-method-all';
    compareTemplateFunction(PATHS, relTestCasePath, done);
  });

  it(`options.data for render`, (done) => {
    const relTestCasePath = 'javascript-option-data-render';
    compareTemplateFunction(PATHS, relTestCasePath, done);
  });

  it(`pug-loader in resource query`, (done) => {
    const relTestCasePath = 'javascript-inline-loader';
    compareTemplateFunction(PATHS, relTestCasePath, done);
  });

  it(`javascript assets compile`, (done) => {
    const relTestCasePath = 'javascript-assets-compile';
    compareTemplateFunction(PATHS, relTestCasePath, done);
  });

  it(`javascript assets render`, (done) => {
    const relTestCasePath = 'javascript-assets-render';
    compareTemplateFunction(PATHS, relTestCasePath, done);
  });

  it(`javascript assets html`, (done) => {
    const relTestCasePath = 'javascript-assets-html';
    compareTemplateFunction(PATHS, relTestCasePath, done);
  });

  it(`javascript esModule=false require`, (done) => {
    const relTestCasePath = 'javascript-esmodule-false-require';
    compareTemplateFunction(PATHS, relTestCasePath, done);
  });

  it(`javascript esModule=true import`, (done) => {
    const relTestCasePath = 'javascript-esmodule-true-import';
    compareTemplateFunction(PATHS, relTestCasePath, done);
  });
});

describe('exception tests', () => {
  test('exception: pug compile', (done) => {
    const relTestCasePath = 'exception-pug-compile';
    const containString = `Pug compilation failed.`;
    exceptionContain(PATHS, relTestCasePath, containString, done);
  });
});