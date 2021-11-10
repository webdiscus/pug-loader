const path = require('path');
const rimraf = require('rimraf');

import { copyRecursiveSync, readTextFileSync, readJsonSync, execScriptSync } from './utils/file';
import { compile, compileTemplate } from './utils/webpack';
import { regexpAlias, resolveAlias, resolveRequirePath, getResourceParams } from '../src';

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

describe('self tests', () => {
  it('test it self', (done) => {
    expect(1).toEqual(1);
    done();
  });

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
});

describe('resolve alias', () => {
  const regexp = regexpAlias;
  const aliases = {
    App: '/path/to/app/',
    Component: '/path/to/component/',
    AppComponent: '/path/to/app-component/',
  };

  it('App/index.pug', () => {
    const value = `App/index.pug`;
    const expected = '/path/to/app/index.pug';
    const received = resolveAlias(value, aliases, regexp);
    expect(received).toEqual(expected);
  });

  it('~App/index.pug', () => {
    const value = `~App/index.pug`;
    const expected = '/path/to/app/index.pug';
    const received = resolveAlias(value, aliases, regexp);
    expect(received).toEqual(expected);
  });

  it('@App/index.pug', () => {
    const value = `@App/index.pug`;
    const expected = '/path/to/app/index.pug';
    const received = resolveAlias(value, aliases, regexp);
    expect(received).toEqual(expected);
  });

  it('+App/index.pug', () => {
    const value = `+App/index.pug`;
    const expected = '+App/index.pug';
    const received = resolveAlias(value, aliases, regexp);
    expect(received).toEqual(expected);
  });

  it('Component/index.pug', () => {
    const value = `Component/index.pug`;
    const expected = '/path/to/component/index.pug';
    const received = resolveAlias(value, aliases, regexp);
    expect(received).toEqual(expected);
  });

  it('App/Component/index.pug', () => {
    const value = `App/Component/index.pug`;
    const expected = '/path/to/app/Component/index.pug';
    const received = resolveAlias(value, aliases, regexp);
    expect(received).toEqual(expected);
  });

  it('App-Component/index.pug', () => {
    const value = `App-Component/index.pug`;
    const expected = 'App-Component/index.pug';
    const received = resolveAlias(value, aliases, regexp);
    expect(received).toEqual(expected);
  });

  it('App_Component/index.pug', () => {
    const value = `App_Component/index.pug`;
    const expected = 'App_Component/index.pug';
    const received = resolveAlias(value, aliases, regexp);
    expect(received).toEqual(expected);
  });

  it('/path/to/App/index.pug', () => {
    const value = `/path/to/App/index.pug`;
    const expected = '/path/to/App/index.pug';
    const received = resolveAlias(value, aliases, regexp);
    expect(received).toEqual(expected);
  });
});

describe('resolve embedded resource', () => {
  const templateFile = '/path/to/source/template.pug';
  const resolveAliases = {
    App: '/path/to/app/',
    Component: '/path/to/component/',
    AppComponent: '/path/to/app-component/',
  };

  it(`img(src=require('./image.jpeg'))`, () => {
    const value = `require('./image.jpeg')`;
    const expected = `require('/path/to/source/' + 'image.jpeg')`;
    const received = resolveRequirePath(value, templateFile, resolveAliases);
    expect(received).toEqual(expected);
  });

  it(`img(src=require("./image.jpeg"))`, () => {
    const value = `require("./image.jpeg")`;
    const expected = `require('/path/to/source/' + "image.jpeg")`;
    const received = resolveRequirePath(value, templateFile, resolveAliases);
    expect(received).toEqual(expected);
  });

  it(`img(src=require('../image.jpeg'))`, () => {
    const value = `require('../image.jpeg')`;
    const expected = `require('/path/to/source/' + '../image.jpeg')`;
    const received = resolveRequirePath(value, templateFile, resolveAliases);
    expect(received).toEqual(expected);
  });

  it(`img(src=require('App/image.jpeg'))`, () => {
    const value = `require('App/image.jpeg')`;
    const expected = `require('/path/to/app/image.jpeg')`;
    const received = resolveRequirePath(value, templateFile, resolveAliases);
    expect(received).toEqual(expected);
  });

  it(`img(src=require('Component/image.jpeg'))`, () => {
    const value = `require('Component/image.jpeg')`;
    const expected = `require('/path/to/component/image.jpeg')`;
    const received = resolveRequirePath(value, templateFile, resolveAliases);
    expect(received).toEqual(expected);
  });

  it(`img(src=require('App/Component/image.jpeg'))`, () => {
    const value = `require('App/Component/image.jpeg')`;
    const expected = `require('/path/to/app/Component/image.jpeg')`;
    const received = resolveRequirePath(value, templateFile, resolveAliases);
    expect(received).toEqual(expected);
  });

  it(`img(src=require('AppTest/image.jpeg'))`, () => {
    const value = `require('AppTest/image.jpeg')`;
    const expected = `require('/path/to/source/' + 'AppTest/image.jpeg')`;
    const received = resolveRequirePath(value, templateFile, resolveAliases);
    expect(received).toEqual(expected);
  });

  it(`img(src=require('App-Component/image.jpeg'))`, () => {
    const value = `require('App-Component/image.jpeg')`;
    const expected = `require('/path/to/source/' + 'App-Component/image.jpeg')`;
    const received = resolveRequirePath(value, templateFile, resolveAliases);
    expect(received).toEqual(expected);
  });

  it(`img(src=require('App_Component/image.jpeg'))`, () => {
    const value = `require('App_Component/image.jpeg')`;
    const expected = `require('/path/to/source/' + 'App_Component/image.jpeg')`;
    const received = resolveRequirePath(value, templateFile, resolveAliases);
    expect(received).toEqual(expected);
  });

  it(`require(path + '')`, () => {
    const value = `require(path + '')`;
    const expected = `require('/path/to/source/' + path + '')`;
    const received = resolveRequirePath(value, templateFile, resolveAliases);
    expect(received).toEqual(expected);
  });

  it(`require('' + path)`, () => {
    const value = `require('' + path)`;
    const expected = `require('/path/to/source/' + '' + path)`;
    const received = resolveRequirePath(value, templateFile, resolveAliases);
    expect(received).toEqual(expected);
  });

  it(`require('' + path + '')`, () => {
    const value = `require('' + path + '')`;
    const expected = `require('/path/to/source/' + '' + path + '')`;
    const received = resolveRequirePath(value, templateFile, resolveAliases);
    expect(received).toEqual(expected);
  });

  it('img(src=require(`${path}`))', () => {
    const value = 'require(`${path}`)';
    const expected = "require('/path/to/source/' + `${path}`)";
    const received = resolveRequirePath(value, templateFile, resolveAliases);
    expect(received).toEqual(expected);
  });

  it('require(`App/images/${file}`)', () => {
    const value = 'require(`App/images/${file}`)';
    const expected = 'require(`/path/to/app/images/${file}`)';
    const received = resolveRequirePath(value, templateFile, resolveAliases);
    expect(received).toEqual(expected);
  });

  it('require(`../../../images/${file}`)', () => {
    const value = 'require(`../../../images/${file}`)';
    const expected = "require('/path/to/source/' + '../../../images/' + `${file}`)";
    const received = resolveRequirePath(value, templateFile, resolveAliases);
    expect(received).toEqual(expected);
  });

  it('img(src=require(`App/${path}`))', () => {
    const value = 'require(`App/${path}`)';
    const expected = 'require(`/path/to/app/${path}`)';
    const received = resolveRequirePath(value, templateFile, resolveAliases);
    expect(received).toEqual(expected);
  });
});

describe('extends, include require javascript', () => {
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

  it(`render embedded resources`, (done) => {
    const relTestCasePath = 'javascript-render-embedded-resources',
      absTestPath = path.join(PATHS.testOutput, relTestCasePath);

    compile(PATHS, relTestCasePath).then(() => {
      const received = execScriptSync(path.join(absTestPath, PATHS.assets, 'index.js'));
      const expected = readTextFileSync(path.join(absTestPath, PATHS.expected, 'output.html'));

      expect(received).toEqual(expected);
      done();
    });
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

  it('?pug_method', () => {
    const expected = {
      pug_method: '',
    };
    const received = getResourceParams('?pug_method');
    expect(received).toEqual(expected);
  });

  it('?pug_method=', () => {
    const expected = {
      pug_method: '',
    };
    const received = getResourceParams('?pug_method=');
    expect(received).toEqual(expected);
  });

  it('?pug_method=&', () => {
    const expected = {
      pug_method: '',
    };
    const received = getResourceParams('?pug_method=&');
    expect(received).toEqual(expected);
  });

  it('?pug_method=render', () => {
    const expected = {
      pug_method: 'render',
    };
    const received = getResourceParams('?pug_method=render');
    expect(received).toEqual(expected);
  });

  it('?pug_method=render&', () => {
    const expected = {
      pug_method: 'render',
    };
    const received = getResourceParams('?pug_method=render&');
    expect(received).toEqual(expected);
  });

  /*it('?pug_render=true', () => {
    const expected = {
      pug_render: true,
    };
    const received = getResourceParams('?pug_render=true');
    expect(received).toEqual(expected);
  });*/

  /*it('?a=123', () => {
    const expected = {
      a: 123,
    };
    const received = getResourceParams('?a=123');
    expect(received).toEqual(expected);
  });*/

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

  it('?pug_method=render&{"a":10,"b":"abc"}', () => {
    const expected = {
      pug_method: 'render',
      a: 10,
      b: 'abc',
    };
    const received = getResourceParams('?pug_method=render&{"a":10,"b":"abc"}');
    expect(received).toEqual(expected);
  });

  it('?pug_method=render&opts={"a":10,"b":"abc"}', () => {
    const expected = {
      pug_method: 'render',
      options: { a: 10, b: 'abc' },
    };
    const received = getResourceParams('?pug_method=render&options={"a":10,"b":"abc"}');
    expect(received).toEqual(expected);
  });

  it('?pug_method=render&opts[]=a1&opts[]=a2', () => {
    const expected = {
      pug_method: 'render',
      args: ['a1', 'a2'],
    };
    const received = getResourceParams('?pug_method=render&args[]=a1&args[]=a2');
    expect(received).toEqual(expected);
  });
});