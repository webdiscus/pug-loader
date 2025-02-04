import { compareFiles, exceptionContain } from './utils/helpers';
import { filterLoadException } from '../src/Exeptions';

describe('pug tests', () => {
  test('hello-world', () => compareFiles('hello-world'));
  test('hello-world-app', () => compareFiles('hello-world-app'));
  test('hello-world-render', () => compareFiles('hello-world-render'));
  test('doctype-html5-mixin', () => compareFiles('doctype-html5-mixin'));
  test('inline-code-minify', () => compareFiles('inline-code-minify'));
  test('escape method compile', () => compareFiles('escape-method-compile'));
  test('escape method render', () => compareFiles('escape-method-render'));
  test('escape method html', () => compareFiles('escape-method-html'));
  test('remove indents in vue and react templates', () => compareFiles('pug-remove-indent-webpack'));
});

describe('extend / include / raw include', () => {
  test('extends alias', () => compareFiles('extends-alias'));
  test('extends relative', () => compareFiles('extends-relative'));
  test('include alias, resolve.alias', () => compareFiles('include-alias-resolve.alias'));
  test('include alias, resolve.plugins', () => compareFiles('include-alias-resolve.plugins'));
  test('include alias, resolve compile', () => compareFiles('include-alias-resolve.plugins-compile'));
  // TODO: fix ERROR: Cannot find module '././image.webp'
  //test('include alias, resolve compile2', () => compareFiles('include-alias-resolve.plugins-compile2'));
  test('include alias, resolve render', () => compareFiles('include-alias-resolve.plugins-render'));
  test('include basedir', () => compareFiles('include-basedir'));
  test('include relative', () => compareFiles('include-relative'));
  test('include script alias', () => compareFiles('include-script-alias'));
  test('include script relative', () => compareFiles('include-script-relative'));
  test('include alias file', () => compareFiles('include-alias-file'));
});

describe('require code', () => {
  test('require json via alias', () => compareFiles('require-json-alias'));
  test('require json relative', () => compareFiles('require-json-relative'));
  test('require js module relative', () => compareFiles('require-js-relative'));
});

describe('require resource', () => {
  test('require-in-all-pug-references', () => compareFiles('require-in-all-pug-references'));
  test('require-alias-array-compile', () => compareFiles('require-alias-array-compile'));
  test('require-alias-array-render', () => compareFiles('require-alias-array-render'));
  test('require-fonts', () => compareFiles('require-fonts'));
  test('require-img-attributes', () => compareFiles('require-img-attributes'));
  test('require-img-srcset', () => compareFiles('require-img-srcset'));
  test('require-img-query-compile', () => compareFiles('require-img-query-compile'));
  test('require-img-query-render', () => compareFiles('require-img-query-render'));
  test('require-img-query-html', () => compareFiles('require-img-query-html'));
  test('require-string', () => compareFiles('require-resource-string'));
  test('require-alias', () => compareFiles('require-resource-alias'));
  test('require-node-module', () => compareFiles('require-node-module'));
  test('require-include-mixin-compile', () => compareFiles('require-resource-include-mixin-compile'));
  test('require-include-mixin-render', () => compareFiles('require-resource-include-mixin-render'));
  test('require-variable-current-dir', () => compareFiles('require-resource-variable-current-dir'));
  test('require-variable-parent-dir', () => compareFiles('require-resource-variable-parent-dir'));
  test('require-variable-sub-dir', () => compareFiles('require-resource-variable-sub-dir'));
  test('require-assets-method-compile', () => compareFiles('require-assets-method-compile'));
  test('require-assets-method-render', () => compareFiles('require-assets-method-render'));
  test('require-assets-method-html', () => compareFiles('require-assets-method-html'));
  test('require-resource-in-mixin-argument', () => compareFiles('require-resource-in-mixin-argument'));
  test('require svg fragment', () => compareFiles('require-img-svg-fragment'));
});

describe('require scripts', () => {
  test('method compile', () => compareFiles('require-scripts-compile'));
  test('method render', () => compareFiles('require-scripts-render'));
  test('method html', () => compareFiles('require-scripts-html'));
  test('webpack config: resolve.modules', () => compareFiles('resolve-modules'));
});

describe('require pug in javascript', () => {
  test(`query method compile`, () => compareFiles('javascript-query-method-compile'));
  test(`query method render`, () => compareFiles('javascript-query-method-render'));
  test(`query methods compile and render`, () => compareFiles('javascript-query-method-all'));
  test(`js assets, compile`, () => compareFiles('javascript-assets-compile'));
  test(`js assets, compile with variables`, () => compareFiles('javascript-assets-compile-vars'));
  test(`js assets, render`, () => compareFiles('javascript-assets-render'));
  test(`js assets, html`, () => compareFiles('javascript-assets-html'));
  test(`js esModule=false require, render`, () => compareFiles('javascript-esm-false-require-render'));
  test(`js esModule=true import, render`, () => compareFiles('javascript-esm-true-import-render'));
  test(`js inline loader`, () => compareFiles('javascript-inline-loader'));
});

describe('embedded filters tests', () => {
  test(`filter escape, method render`, () => compareFiles('filter-escape'));
  test(`filter code, method render`, () => compareFiles('filter-code'));
  test(`:code include files`, () => compareFiles('filter-code-include-files'));
  test(`filter highlight, method render`, () => compareFiles('filter-highlight'));
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
  test(`name`, () => compareFiles('option-name'));
  test(`esModule=false`, () => compareFiles('option-esModule-false'));
  test(`esModule=true`, () => compareFiles('option-esModule-true'));

  test(`default mode in js`, () => compareFiles('option-mode-default-js'));
  test(`render mode in js`, () => compareFiles('option-mode-render-js'));
  test(`mix modes in js: default with render`, () => compareFiles('option-mode-default-with-render-js'));
  test(`html mode`, () => compareFiles('option-mode-html-js'));

  test(`watchFiles, render`, () => compareFiles('option-watchFiles'));
});

describe('options: pass data', () => {
  test(`entry js, method compile`, () => compareFiles('option-data-js-compile'));
  test(`entry js, method render`, () => compareFiles('option-data-js-render'));
  test('entry pug method compile', () => compareFiles('option-data-pug-compile'));
  test('entry pug method render', () => compareFiles('option-data-pug-render'));
  test(`use self, compile`, () => compareFiles('option-data-self-compile'));
  test(`use self, render`, () => compareFiles('option-data-self-render'));
});

describe('using html-webpack-plugin', () => {
  test('multiple pages pass data, js, scss, image', () => compareFiles('html-webpack-plugin'));
  test('pass data from plugin options', () => compareFiles('html-webpack-plugin-options'));
  test('pass data from plugin options and query', () => compareFiles('html-webpack-plugin-options-query'));
  test('pass diff data in one template', () => compareFiles('html-webpack-plugin-diff-data-one-template'));
});

describe('exception tests', () => {
  test('exception: pug compile', () => {
    const containString = `Pug compilation failed.`;
    return exceptionContain('exception-pug-compile', containString);
  });

  test('exception: evaluate template function', () => {
    const containString = `Failed to execute template function`;
    return exceptionContain('exception-evaluate-template', containString);
  });

  test('exception: evaluate template function 2', () => {
    // test the concrete error message of the pug compiler
    const containString = `Anonymous blocks are not allowed unless they are part of a mixin.`;
    return exceptionContain('exception-evaluate-template2', containString);
  });

  test('exception: file cannot be resolved', () => {
    const containString = `can't be resolved`;
    return exceptionContain('exception-resolve', containString);
  });

  test('exception: filter not found', () => {
    const containString = `The 'embedFilters' option contains unknown filter:`;
    return exceptionContain('exception-filter-not-found', containString);
  });

  test('exception: by load a filter', (done) => {
    const expected = `Error by load`;
    const result = () => {
      filterLoadException('filter', '/path/', new Error('module not found'));
    };
    expect(result).toThrow(expected);
    done();
  });

  test('exception: filter :highlight - unsupported module', () => {
    const filterHighlight = require('../src/filters/highlight');
    const adapterHighlight = require('../src/filters/highlight/adapter');
    // reset cached module
    adapterHighlight.module = null;
    filterHighlight.module = null;

    const containString = `unsupported highlight module`;
    return exceptionContain('exception-filter-highlight-unsupported-module', containString);
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

  test('exception: script can\'t be interpolated with the \'compile\' mode', () => {
    const containString = `can't be interpolated with the 'compile' mode`;
    return exceptionContain('exception-interpolation-unsupported-script', containString);
  });

  test('exception: file can\'t be interpolated with the \'compile\' mode', () => {
    const containString = `can't be interpolated with the 'compile' mode`;
    return exceptionContain('exception-interpolation-unsupported-value', containString);
  });
});