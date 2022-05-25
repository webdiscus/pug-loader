import { filterLoadException } from '../src/exeptions';

const path = require('path');
const rimraf = require('rimraf');

import { copyRecursiveSync } from './utils/file';
import { compareContent, compareFileListAndContent, compareTemplateFunction, exceptionContain } from './utils/helpers';

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

  test('remove indents in vue and react templates', (done) => {
    const relTestCasePath = 'pug-remove-indent';
    compareFileListAndContent(PATHS, relTestCasePath, done);
  });

  test('escape method compile', (done) => {
    const relTestCasePath = 'escape-method-compile';
    compareContent(PATHS, relTestCasePath, done);
  });

  test('escape method render', (done) => {
    const relTestCasePath = 'escape-method-render';
    compareContent(PATHS, relTestCasePath, done);
  });

  test('escape method html', (done) => {
    const relTestCasePath = 'escape-method-html';
    compareContent(PATHS, relTestCasePath, done);
  });

  test('pass options from html-webpack-plugin', (done) => {
    const relTestCasePath = 'html-webpack-plugin-options';
    compareFileListAndContent(PATHS, relTestCasePath, done);
  });
});

describe('pass data tests', () => {
  test('pass-data-method-compile', (done) => {
    const relTestCasePath = 'pass-data-method-compile';
    compareContent(PATHS, relTestCasePath, done);
  });

  test('pass-data-method-render', (done) => {
    const relTestCasePath = 'pass-data-method-render';
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

  test('include alias from resolve.plugins', (done) => {
    const relTestCasePath = 'include-alias-resolve.plugins';
    compareContent(PATHS, relTestCasePath, done);
  });

  test('include alias from resolve.plugin-compile', (done) => {
    const relTestCasePath = 'include-alias-resolve.plugins-compile';
    compareContent(PATHS, relTestCasePath, done);
  });

  test('include alias from resolve.plugin-render', (done) => {
    const relTestCasePath = 'include-alias-resolve.plugins-render';
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
  test('require json via alias', (done) => {
    const relTestCasePath = 'require-json-alias';
    compareContent(PATHS, relTestCasePath, done);
  });

  test('require json relative', (done) => {
    const relTestCasePath = 'require-json-relative';
    compareContent(PATHS, relTestCasePath, done);
  });

  test('require js module relative', (done) => {
    const relTestCasePath = 'require-js-relative';
    compareContent(PATHS, relTestCasePath, done);
  });
});

describe('require resource', () => {
  test('require-alias-array-compile', (done) => {
    const relTestCasePath = 'require-alias-array-compile';
    compareContent(PATHS, relTestCasePath, done);
  });

  test('require-alias-array-render', (done) => {
    const relTestCasePath = 'require-alias-array-render';
    compareContent(PATHS, relTestCasePath, done);
  });

  test('require-fonts', (done) => {
    const relTestCasePath = 'require-fonts';
    compareContent(PATHS, relTestCasePath, done);
  });

  test('require-img-srcset', (done) => {
    const relTestCasePath = 'require-img-srcset';
    compareContent(PATHS, relTestCasePath, done);
  });

  test('require-string', (done) => {
    const relTestCasePath = 'require-resource-string';
    compareContent(PATHS, relTestCasePath, done);
  });

  test('require-alias', (done) => {
    const relTestCasePath = 'require-resource-alias';
    compareContent(PATHS, relTestCasePath, done);
  });

  test('require-node-module', (done) => {
    const relTestCasePath = 'require-node-module';
    compareContent(PATHS, relTestCasePath, done);
  });

  test('require-include-mixin-compile', (done) => {
    const relTestCasePath = 'require-resource-include-mixin-compile';
    compareContent(PATHS, relTestCasePath, done);
  });

  test('require-include-mixin-render', (done) => {
    const relTestCasePath = 'require-resource-include-mixin-render';
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

  test('require-assets-method-compile', (done) => {
    const relTestCasePath = 'require-assets-method-compile';
    compareFileListAndContent(PATHS, relTestCasePath, done);
  });

  test('require-assets-method-render', (done) => {
    const relTestCasePath = 'require-assets-method-render';
    compareFileListAndContent(PATHS, relTestCasePath, done);
  });

  test('require-assets-method-html', (done) => {
    const relTestCasePath = 'require-assets-method-html';
    compareFileListAndContent(PATHS, relTestCasePath, done);
  });

  test('require-scripts-compile', (done) => {
    const relTestCasePath = 'require-scripts-compile';
    compareFileListAndContent(PATHS, relTestCasePath, done);
  });

  test('require-scripts-render', (done) => {
    const relTestCasePath = 'require-scripts-render';
    compareFileListAndContent(PATHS, relTestCasePath, done);
  });

  test('require-scripts-html', (done) => {
    const relTestCasePath = 'require-scripts-html';
    compareFileListAndContent(PATHS, relTestCasePath, done);
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

  test(`options.data, method compile`, (done) => {
    const relTestCasePath = 'javascript-option-data-compile';
    compareTemplateFunction(PATHS, relTestCasePath, done);
  });

  test(`options.data, method render`, (done) => {
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

  test(`javascript assets compile with variables`, (done) => {
    const relTestCasePath = 'javascript-assets-compile-vars';
    compareTemplateFunction(PATHS, relTestCasePath, done);
  });

  test(`javascript assets, method render`, (done) => {
    const relTestCasePath = 'javascript-assets-render';
    compareTemplateFunction(PATHS, relTestCasePath, done);
  });

  test(`javascript assets, method html`, (done) => {
    const relTestCasePath = 'javascript-assets-html';
    compareTemplateFunction(PATHS, relTestCasePath, done);
  });

  test(`javascript esModule=false require, method render`, (done) => {
    const relTestCasePath = 'javascript-esmodule-false-require-render';
    compareTemplateFunction(PATHS, relTestCasePath, done);
  });

  test(`javascript esModule=true import, method render`, (done) => {
    const relTestCasePath = 'javascript-esmodule-true-import-render';
    compareTemplateFunction(PATHS, relTestCasePath, done);
  });
});

describe('embedded filters tests', () => {
  test(`filter escape, method render`, (done) => {
    const relTestCasePath = 'filter-escape';
    compareContent(PATHS, relTestCasePath, done);
  });

  test(`filter code, method render`, (done) => {
    const relTestCasePath = 'filter-code';
    compareContent(PATHS, relTestCasePath, done);
  });

  test(`filter highlight, method render`, (done) => {
    const relTestCasePath = 'filter-highlight';
    compareContent(PATHS, relTestCasePath, done);
  });

  test('highlight prismjs - isInitialized', (done) => {
    const prismjs = require('../src/filters/highlight/prismjs');
    // reset cached module
    prismjs.module = null;
    prismjs.init({});

    const result = prismjs.isInitialized();
    expect(result).toBeTruthy();
    done();
  });
});

describe('exception tests', () => {
  test('exception: pug compile', (done) => {
    const relTestCasePath = 'exception-pug-compile';
    const containString = `Pug compilation failed.`;
    exceptionContain(PATHS, relTestCasePath, containString, done);
  });

  test('exception: evaluate template function', (done) => {
    const relTestCasePath = 'exception-evaluate-template';
    const containString = `Failed to execute template function`;
    exceptionContain(PATHS, relTestCasePath, containString, done);
  });

  test('exception: file cannot be resolved', (done) => {
    const relTestCasePath = 'exception-resolve';
    const containString = `can't be resolved`;
    exceptionContain(PATHS, relTestCasePath, containString, done);
  });

  test('exception: filter not found', (done) => {
    const relTestCasePath = 'exception-filter-not-found';
    const containString = `The 'embedFilters' option contains unknown filter:`;
    exceptionContain(PATHS, relTestCasePath, containString, done);
  });

  test('exception: by load a filter', (done) => {
    const { filterLoadException } = require('../src/exeptions');
    const expected = `Error by load`;
    const result = () => {
      filterLoadException('filter', '/path/', new Error('module not found'));
    };
    expect(result).toThrow(expected);
    done();
  });

  test('exception: filter :highlight - unsupported module', (done) => {
    const filterHighlight = require('../src/filters/highlight');
    const adapterHighlight = require('../src/filters/highlight/adapter');
    // reset cached module
    adapterHighlight.module = null;
    filterHighlight.module = null;

    const relTestCasePath = 'exception-filter-highlight-unsupported-module';
    const containString = `unsupported highlight module`;
    exceptionContain(PATHS, relTestCasePath, containString, done);
  });

  test('exception: filter :highlight adapter - unsupported module', (done) => {
    const adapterHighlight = require('../src/filters/highlight/adapter');
    // reset cached module
    adapterHighlight.module = null;

    const expected = `Used unsupported module`;
    const result = () => {
      adapterHighlight.init({ use: 'unsupported-module' });
    };
    expect(result).toThrow(expected);
    done();
  });

  test("exception: file can't be interpolated with the 'compile' method", (done) => {
    const relTestCasePath = 'exception-interpolation-unsupported-value';
    const containString = `can't be interpolated with the 'compile' method`;
    exceptionContain(PATHS, relTestCasePath, containString, done);
  });
});