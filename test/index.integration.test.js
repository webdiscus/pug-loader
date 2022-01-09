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
  test('hello-world', (done) => {
    const relTestCasePath = 'hello-world';
    compareContent(PATHS, relTestCasePath, done);
  });

  test('escape render', (done) => {
    const relTestCasePath = 'escape-render';
    compareContent(PATHS, relTestCasePath, done);
  });
});

describe('extend / include / raw include', () => {
  test('extends-alias', (done) => {
    const relTestCasePath = 'extends-alias';
    compareContent(PATHS, relTestCasePath, done);
  });

  test('extends-relative', (done) => {
    const relTestCasePath = 'extends-relative';
    compareContent(PATHS, relTestCasePath, done);
  });

  test('include alias from resolve.alias', (done) => {
    const relTestCasePath = 'include-alias-resolve.alias';
    compareContent(PATHS, relTestCasePath, done);
  });

  test('include alias from resolve.plugin', (done) => {
    const relTestCasePath = 'include-alias-resolve.plugins';
    compareContent(PATHS, relTestCasePath, done);
  });

  test('include-basedir', (done) => {
    const relTestCasePath = 'include-basedir';
    compareContent(PATHS, relTestCasePath, done);
  });

  test('include-relative', (done) => {
    const relTestCasePath = 'include-relative';
    compareContent(PATHS, relTestCasePath, done);
  });

  test('include-script-alias', (done) => {
    const relTestCasePath = 'include-script-alias';
    compareContent(PATHS, relTestCasePath, done);
  });

  test('include-script-relative', (done) => {
    const relTestCasePath = 'include-script-relative';
    compareContent(PATHS, relTestCasePath, done);
  });
});

describe('require code', () => {
  test('require-json-alias', (done) => {
    const relTestCasePath = 'require-json-alias';
    compareContent(PATHS, relTestCasePath, done);
  });

  test('require-json-relative', (done) => {
    const relTestCasePath = 'require-json-relative';
    compareContent(PATHS, relTestCasePath, done);
  });
});

describe('require resource', () => {
  test('require-string', (done) => {
    const relTestCasePath = 'require-resource-string';
    compareContent(PATHS, relTestCasePath, done);
  });

  test('require-alias', (done) => {
    const relTestCasePath = 'require-resource-alias';
    compareContent(PATHS, relTestCasePath, done);
  });

  test('require-include-mixin', (done) => {
    const relTestCasePath = 'require-resource-include-mixin';
    compareContent(PATHS, relTestCasePath, done);
  });

  test('require-variable-current-dir', (done) => {
    const relTestCasePath = 'require-resource-variable-current-dir';
    compareContent(PATHS, relTestCasePath, done);
  });

  test('require-variable-parent-dir', (done) => {
    const relTestCasePath = 'require-resource-variable-parent-dir';
    compareContent(PATHS, relTestCasePath, done);
  });

  test('require-variable-sub-dir', (done) => {
    const relTestCasePath = 'require-resource-variable-sub-dir';
    compareContent(PATHS, relTestCasePath, done);
  });
});

describe('require pug in javascript', () => {
  test(`options.method default`, (done) => {
    const relTestCasePath = 'javascript-option-method-default';
    compareTemplateFunction(PATHS, relTestCasePath, done);
  });

  test(`options.method=render`, (done) => {
    const relTestCasePath = 'javascript-option-method-render';
    compareTemplateFunction(PATHS, relTestCasePath, done);
  });

  test(`options.method=rtRender`, (done) => {
    const relTestCasePath = 'javascript-option-method-rtrender';
    compareTemplateFunction(PATHS, relTestCasePath, done);
  });

  test(`options.method=html`, (done) => {
    const relTestCasePath = 'javascript-option-method-html';
    compareTemplateFunction(PATHS, relTestCasePath, done);
  });

  test(`query method compile`, (done) => {
    const relTestCasePath = 'javascript-query-method-compile';
    compareTemplateFunction(PATHS, relTestCasePath, done);
  });

  test(`query method render`, (done) => {
    const relTestCasePath = 'javascript-query-method-render';
    compareTemplateFunction(PATHS, relTestCasePath, done);
  });

  test(`query methods compile and render`, (done) => {
    const relTestCasePath = 'javascript-query-method-all';
    compareTemplateFunction(PATHS, relTestCasePath, done);
  });

  test(`options.data for render`, (done) => {
    const relTestCasePath = 'javascript-option-data-render';
    compareTemplateFunction(PATHS, relTestCasePath, done);
  });

  test(`pug-loader in resource query`, (done) => {
    const relTestCasePath = 'javascript-inline-loader';
    compareTemplateFunction(PATHS, relTestCasePath, done);
  });

  test(`javascript assets compile`, (done) => {
    const relTestCasePath = 'javascript-assets-compile';
    compareTemplateFunction(PATHS, relTestCasePath, done);
  });

  test(`javascript assets render`, (done) => {
    const relTestCasePath = 'javascript-assets-render';
    compareTemplateFunction(PATHS, relTestCasePath, done);
  });

  test(`javascript assets html`, (done) => {
    const relTestCasePath = 'javascript-assets-html';
    compareTemplateFunction(PATHS, relTestCasePath, done);
  });

  test(`javascript esModule=false require`, (done) => {
    const relTestCasePath = 'javascript-esmodule-false-require';
    compareTemplateFunction(PATHS, relTestCasePath, done);
  });

  test(`javascript esModule=true import`, (done) => {
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