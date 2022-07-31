import { compareContent, compareFileListAndContent, compareTemplateFunction, exceptionContain } from './utils/helpers';
import { filterLoadException } from '../src/Exeptions';

const path = require('path');

const PATHS = {
  base: __dirname,
  testSource: path.join(__dirname, 'cases'),
  // relative path in the test directory to web root dir name, same as by a web server (e.g. nginx)
  webRoot: '/public/',
  // relative path in the test directory to expected files for test
  expected: '/expected/',
  // relative path in the public directory
  output: '/assets/',
};

// 10s is required for test on slow instance like github
const testTimeout = 10000;

beforeAll(() => {});

beforeEach(() => {
  // on linux/macOS not work set the testTimeout in jest.config.js
  jest.setTimeout(testTimeout);
});

describe('pug tests', () => {
  test('hello-world-simple', (done) => {
    const relTestCasePath = 'hello-world';
    compareFileListAndContent(PATHS, relTestCasePath, done);
  });

  test('hello-world-app', (done) => {
    const relTestCasePath = 'hello-world-app';
    compareFileListAndContent(PATHS, relTestCasePath, done);
  });

  test('doctype-html5-mixin', (done) => {
    const relTestCasePath = 'doctype-html5-mixin';
    compareFileListAndContent(PATHS, relTestCasePath, done);
  });

  test('remove indents in vue and react templates', (done) => {
    const relTestCasePath = 'pug-remove-indent-webpack';
    compareTemplateFunction(PATHS, relTestCasePath, done);
  });

  test('inline-code-minify', (done) => {
    const relTestCasePath = 'inline-code-minify';
    compareFileListAndContent(PATHS, relTestCasePath, done);
  });

  test('escape method compile', (done) => {
    const relTestCasePath = 'escape-method-compile';
    compareFileListAndContent(PATHS, relTestCasePath, done);
  });

  test('escape method render', (done) => {
    const relTestCasePath = 'escape-method-render';
    compareFileListAndContent(PATHS, relTestCasePath, done);
  });

  test('escape method html', (done) => {
    const relTestCasePath = 'escape-method-html';
    compareFileListAndContent(PATHS, relTestCasePath, done);
  });
});

describe('extend / include / raw include', () => {
  test('extends-alias', (done) => {
    const relTestCasePath = 'extends-alias';
    compareFileListAndContent(PATHS, relTestCasePath, done);
  });

  test('extends-relative', (done) => {
    const relTestCasePath = 'extends-relative';
    compareFileListAndContent(PATHS, relTestCasePath, done);
  });

  test('include alias from resolve.alias', (done) => {
    const relTestCasePath = 'include-alias-resolve.alias';
    compareFileListAndContent(PATHS, relTestCasePath, done);
  });

  test('include alias from resolve.plugins', (done) => {
    const relTestCasePath = 'include-alias-resolve.plugins';
    compareFileListAndContent(PATHS, relTestCasePath, done);
  });

  test('include alias from resolve.plugin-compile', (done) => {
    const relTestCasePath = 'include-alias-resolve.plugins-compile';
    compareFileListAndContent(PATHS, relTestCasePath, done);
  });

  test('include alias from resolve.plugin-render', (done) => {
    const relTestCasePath = 'include-alias-resolve.plugins-render';
    compareFileListAndContent(PATHS, relTestCasePath, done);
  });

  test('include-basedir', (done) => {
    const relTestCasePath = 'include-basedir';
    compareFileListAndContent(PATHS, relTestCasePath, done);
  });

  test('include-relative', (done) => {
    const relTestCasePath = 'include-relative';
    compareFileListAndContent(PATHS, relTestCasePath, done);
  });

  test('include-script-alias', (done) => {
    const relTestCasePath = 'include-script-alias';
    compareFileListAndContent(PATHS, relTestCasePath, done);
  });

  test('include-script-relative', (done) => {
    const relTestCasePath = 'include-script-relative';
    compareFileListAndContent(PATHS, relTestCasePath, done);
  });

  test('include-alias-file', (done) => {
    const relTestCasePath = 'include-alias-file';
    compareContent(PATHS, relTestCasePath, done);
  });
});

describe('require code', () => {
  test('require json via alias', (done) => {
    const relTestCasePath = 'require-json-alias';
    compareFileListAndContent(PATHS, relTestCasePath, done);
  });

  test('require json relative', (done) => {
    const relTestCasePath = 'require-json-relative';
    compareFileListAndContent(PATHS, relTestCasePath, done);
  });

  test('require js module relative', (done) => {
    const relTestCasePath = 'require-js-relative';
    compareFileListAndContent(PATHS, relTestCasePath, done);
  });
});

describe('require resource', () => {
  test('require-alias-array-compile', (done) => {
    const relTestCasePath = 'require-alias-array-compile';
    compareFileListAndContent(PATHS, relTestCasePath, done);
  });

  test('require-alias-array-render', (done) => {
    const relTestCasePath = 'require-alias-array-render';
    compareFileListAndContent(PATHS, relTestCasePath, done);
  });

  test('require-fonts', (done) => {
    const relTestCasePath = 'require-fonts';
    compareFileListAndContent(PATHS, relTestCasePath, done);
  });

  test('require-img-srcset', (done) => {
    const relTestCasePath = 'require-img-srcset';
    compareFileListAndContent(PATHS, relTestCasePath, done);
  });

  test('require-img-query-compile', (done) => {
    const relTestCasePath = 'require-img-query-compile';
    compareFileListAndContent(PATHS, relTestCasePath, done);
  });

  test('require-img-query-render', (done) => {
    const relTestCasePath = 'require-img-query-render';
    compareFileListAndContent(PATHS, relTestCasePath, done);
  });

  test('require-img-query-html', (done) => {
    const relTestCasePath = 'require-img-query-html';
    compareFileListAndContent(PATHS, relTestCasePath, done);
  });

  test('require-string', (done) => {
    const relTestCasePath = 'require-resource-string';
    compareFileListAndContent(PATHS, relTestCasePath, done);
  });

  test('require-alias', (done) => {
    const relTestCasePath = 'require-resource-alias';
    compareFileListAndContent(PATHS, relTestCasePath, done);
  });

  test('require-node-module', (done) => {
    const relTestCasePath = 'require-node-module';
    compareFileListAndContent(PATHS, relTestCasePath, done);
  });

  test('require-include-mixin-compile', (done) => {
    const relTestCasePath = 'require-resource-include-mixin-compile';
    compareFileListAndContent(PATHS, relTestCasePath, done);
  });

  test('require-include-mixin-render', (done) => {
    const relTestCasePath = 'require-resource-include-mixin-render';
    compareFileListAndContent(PATHS, relTestCasePath, done);
  });

  test('require-variable-current-dir', (done) => {
    const relTestCasePath = 'require-resource-variable-current-dir';
    compareFileListAndContent(PATHS, relTestCasePath, done);
  });

  test('require-variable-parent-dir', (done) => {
    const relTestCasePath = 'require-resource-variable-parent-dir';
    compareFileListAndContent(PATHS, relTestCasePath, done);
  });

  test('require-variable-sub-dir', (done) => {
    const relTestCasePath = 'require-resource-variable-sub-dir';
    compareFileListAndContent(PATHS, relTestCasePath, done);
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
});

describe('require scripts', () => {
  test('method compile', (done) => {
    const relTestCasePath = 'require-scripts-compile';
    compareFileListAndContent(PATHS, relTestCasePath, done);
  });

  test('method render', (done) => {
    const relTestCasePath = 'require-scripts-render';
    compareFileListAndContent(PATHS, relTestCasePath, done);
  });

  test('method html', (done) => {
    const relTestCasePath = 'require-scripts-html';
    compareFileListAndContent(PATHS, relTestCasePath, done);
  });

  test('webpack config: resolve.modules', (done) => {
    const relTestCasePath = 'resolve-modules';
    compareFileListAndContent(PATHS, relTestCasePath, done);
  });
});

describe('require pug in javascript', () => {
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
    const relTestCasePath = 'javascript-esm-false-require-render';
    compareTemplateFunction(PATHS, relTestCasePath, done);
  });

  test(`javascript esModule=true import, method render`, (done) => {
    const relTestCasePath = 'javascript-esm-true-import-render';
    compareTemplateFunction(PATHS, relTestCasePath, done);
  });
});

describe('embedded filters tests', () => {
  test(`filter escape, method render`, (done) => {
    const relTestCasePath = 'filter-escape';
    compareFileListAndContent(PATHS, relTestCasePath, done);
  });

  test(`filter code, method render`, (done) => {
    const relTestCasePath = 'filter-code';
    compareFileListAndContent(PATHS, relTestCasePath, done);
  });

  test(`filter highlight, method render`, (done) => {
    const relTestCasePath = 'filter-highlight';
    compareFileListAndContent(PATHS, relTestCasePath, done);
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

describe('options tests', () => {
  test(`options.method default`, (done) => {
    const relTestCasePath = 'option-method-default-js';
    compareTemplateFunction(PATHS, relTestCasePath, done);
  });

  test(`options.method=render`, (done) => {
    const relTestCasePath = 'option-method-render-js';
    compareTemplateFunction(PATHS, relTestCasePath, done);
  });

  test(`options.method=html`, (done) => {
    const relTestCasePath = 'option-method-html-js';
    compareTemplateFunction(PATHS, relTestCasePath, done);
  });

  test(`option-watchFiles, method render`, (done) => {
    const relTestCasePath = 'option-watchFiles';
    compareFileListAndContent(PATHS, relTestCasePath, done);
  });
});

describe('options: pass data', () => {
  test(`options.data, entry js, method compile`, (done) => {
    const relTestCasePath = 'option-data-js-compile';
    compareTemplateFunction(PATHS, relTestCasePath, done);
  });

  test(`options.data, entry js, method render`, (done) => {
    const relTestCasePath = 'option-data-js-render';
    compareTemplateFunction(PATHS, relTestCasePath, done);
  });

  test('options.data entry pug method compile', (done) => {
    const relTestCasePath = 'option-data-pug-compile';
    compareFileListAndContent(PATHS, relTestCasePath, done);
  });

  test('options.data entry pug method render', (done) => {
    const relTestCasePath = 'option-data-pug-render';
    compareFileListAndContent(PATHS, relTestCasePath, done);
  });
});

describe('pass data in html-webpack-plugin', () => {
  test('pass data from plugin options', (done) => {
    const relTestCasePath = 'html-webpack-plugin-options';
    compareFileListAndContent(PATHS, relTestCasePath, done);
  });

  test('pass data from plugin options and query', (done) => {
    const relTestCasePath = 'html-webpack-plugin-options-query';
    compareFileListAndContent(PATHS, relTestCasePath, done);
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

  test("exception: script can't be interpolated with the 'compile' method", (done) => {
    const relTestCasePath = 'exception-interpolation-unsupported-script';
    const containString = `can't be interpolated with the 'compile' method`;
    exceptionContain(PATHS, relTestCasePath, containString, done);
  });

  test("exception: file can't be interpolated with the 'compile' method", (done) => {
    const relTestCasePath = 'exception-interpolation-unsupported-value';
    const containString = `can't be interpolated with the 'compile' method`;
    exceptionContain(PATHS, relTestCasePath, containString, done);
  });
});