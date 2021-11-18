import { getResourceParams, resolveTemplatePath, resolveResourcePath } from '../src/utils';
import loaderMethods from '../src/loader-methods';

describe('self tests', () => {
  it('test it self', (done) => {
    expect(1).toEqual(1);
    done();
  });
});

describe('resolve alias', () => {
  const aliases = {
    App: '/path/to/app/',
    Component: '/path/to/component/',
    AppComponent: '/path/to/app-component/',
  };

  it('App/index.pug', () => {
    const value = `App/index.pug`;
    const expected = '/path/to/app/index.pug';
    const received = resolveTemplatePath(value, aliases);
    expect(received).toEqual(expected);
  });

  it('~App/index.pug', () => {
    const value = `~App/index.pug`;
    const expected = '/path/to/app/index.pug';
    const received = resolveTemplatePath(value, aliases);
    expect(received).toEqual(expected);
  });

  it('@App/index.pug', () => {
    const value = `@App/index.pug`;
    const expected = '/path/to/app/index.pug';
    const received = resolveTemplatePath(value, aliases);
    expect(received).toEqual(expected);
  });

  it('+App/index.pug', () => {
    const value = `+App/index.pug`;
    const expected = '+App/index.pug';
    const received = resolveTemplatePath(value, aliases);
    expect(received).toEqual(expected);
  });

  it('Component/index.pug', () => {
    const value = `Component/index.pug`;
    const expected = '/path/to/component/index.pug';
    const received = resolveTemplatePath(value, aliases);
    expect(received).toEqual(expected);
  });

  it('App/Component/index.pug', () => {
    const value = `App/Component/index.pug`;
    const expected = '/path/to/app/Component/index.pug';
    const received = resolveTemplatePath(value, aliases);
    expect(received).toEqual(expected);
  });

  it('App-Component/index.pug', () => {
    const value = `App-Component/index.pug`;
    const expected = 'App-Component/index.pug';
    const received = resolveTemplatePath(value, aliases);
    expect(received).toEqual(expected);
  });

  it('App_Component/index.pug', () => {
    const value = `App_Component/index.pug`;
    const expected = 'App_Component/index.pug';
    const received = resolveTemplatePath(value, aliases);
    expect(received).toEqual(expected);
  });

  it('/path/to/App/index.pug', () => {
    const value = `/path/to/App/index.pug`;
    const expected = '/path/to/App/index.pug';
    const received = resolveTemplatePath(value, aliases);
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

  const [compileMethod, renderMethod, htmlMethod] = loaderMethods;

  it(`img(src=require('./image.jpeg'))`, () => {
    const value = `require('./image.jpeg')`;
    const expected = `require('/path/to/source/' + 'image.jpeg')`;
    const received = resolveResourcePath(templateFile, value, resolveAliases, compileMethod);
    expect(received).toEqual(expected);
  });

  it(`img(src=require("./image.jpeg"))`, () => {
    const value = `require("./image.jpeg")`;
    const expected = `require('/path/to/source/' + "image.jpeg")`;
    const received = resolveResourcePath(templateFile, value, resolveAliases, compileMethod);
    expect(received).toEqual(expected);
  });

  it(`img(src=require('../image.jpeg'))`, () => {
    const value = `require('../image.jpeg')`;
    const expected = `require('/path/to/source/' + '../image.jpeg')`;
    const received = resolveResourcePath(templateFile, value, resolveAliases, compileMethod);
    expect(received).toEqual(expected);
  });

  it(`img(src=require('App/image.jpeg'))`, () => {
    const value = `require('App/image.jpeg')`;
    const expected = `require('/path/to/app/image.jpeg')`;
    const received = resolveResourcePath(templateFile, value, resolveAliases, compileMethod);
    expect(received).toEqual(expected);
  });

  it(`img(src=require('Component/image.jpeg'))`, () => {
    const value = `require('Component/image.jpeg')`;
    const expected = `require('/path/to/component/image.jpeg')`;
    const received = resolveResourcePath(templateFile, value, resolveAliases, compileMethod);
    expect(received).toEqual(expected);
  });

  it(`img(src=require('App/Component/image.jpeg'))`, () => {
    const value = `require('App/Component/image.jpeg')`;
    const expected = `require('/path/to/app/Component/image.jpeg')`;
    const received = resolveResourcePath(templateFile, value, resolveAliases, compileMethod);
    expect(received).toEqual(expected);
  });

  it(`img(src=require('AppTest/image.jpeg'))`, () => {
    const value = `require('AppTest/image.jpeg')`;
    const expected = `require('/path/to/source/' + 'AppTest/image.jpeg')`;
    const received = resolveResourcePath(templateFile, value, resolveAliases, compileMethod);
    expect(received).toEqual(expected);
  });

  it(`img(src=require('App-Component/image.jpeg'))`, () => {
    const value = `require('App-Component/image.jpeg')`;
    const expected = `require('/path/to/source/' + 'App-Component/image.jpeg')`;
    const received = resolveResourcePath(templateFile, value, resolveAliases, compileMethod);
    expect(received).toEqual(expected);
  });

  it(`img(src=require('App_Component/image.jpeg'))`, () => {
    const value = `require('App_Component/image.jpeg')`;
    const expected = `require('/path/to/source/' + 'App_Component/image.jpeg')`;
    const received = resolveResourcePath(templateFile, value, resolveAliases, compileMethod);
    expect(received).toEqual(expected);
  });

  it(`require(path + '')`, () => {
    const value = `require(path + '')`;
    const expected = `require('/path/to/source/' + path + '')`;
    const received = resolveResourcePath(templateFile, value, resolveAliases, compileMethod);
    expect(received).toEqual(expected);
  });

  it(`require('' + path)`, () => {
    const value = `require('' + path)`;
    const expected = `require('/path/to/source/' + '' + path)`;
    const received = resolveResourcePath(templateFile, value, resolveAliases, compileMethod);
    expect(received).toEqual(expected);
  });

  it(`require('' + path + '')`, () => {
    const value = `require('' + path + '')`;
    const expected = `require('/path/to/source/' + '' + path + '')`;
    const received = resolveResourcePath(templateFile, value, resolveAliases, compileMethod);
    expect(received).toEqual(expected);
  });

  it('img(src=require(`${path}`))', () => {
    const value = 'require(`${path}`)';
    const expected = "require('/path/to/source/' + `${path}`)";
    const received = resolveResourcePath(templateFile, value, resolveAliases, compileMethod);
    expect(received).toEqual(expected);
  });

  it('require(`App/images/${file}`)', () => {
    const value = 'require(`App/images/${file}`)';
    const expected = 'require(`/path/to/app/images/${file}`)';
    const received = resolveResourcePath(templateFile, value, resolveAliases, compileMethod);
    expect(received).toEqual(expected);
  });

  it('require(`../../../images/${file}`)', () => {
    const value = 'require(`../../../images/${file}`)';
    const expected = "require('/path/to/source/' + '../../../images/' + `${file}`)";
    const received = resolveResourcePath(templateFile, value, resolveAliases, compileMethod);
    expect(received).toEqual(expected);
  });

  it('img(src=require(`App/${path}`))', () => {
    const value = 'require(`App/${path}`)';
    const expected = 'require(`/path/to/app/${path}`)';
    const received = resolveResourcePath(templateFile, value, resolveAliases, compileMethod);
    expect(received).toEqual(expected);
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

  /*it('?pug-render=true', () => {
    const expected = {
      'pug-render': true,
    };
    const received = getResourceParams('?pug-render=true');
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