import path from 'path';
import { execScriptSync, readTextFileSync } from './file';
import { compile } from './webpack';

export const getCompareFileContents = function (receivedFile, expectedFile, filter = /.(html|css|css.map)$/) {
  return filter.test(receivedFile) && filter.test(expectedFile)
    ? { received: readTextFileSync(receivedFile), expected: readTextFileSync(expectedFile) }
    : { received: '', expected: '' };
};

export const compareContent = (
  PATHS,
  relTestCasePath,
  done,
  receivedFile = 'index.html',
  expectedFile = 'index.html'
) => {
  const absTestPath = path.join(PATHS.testOutput, relTestCasePath);

  compile(PATHS, relTestCasePath, {}).then(() => {
    const received = readTextFileSync(path.join(absTestPath, PATHS.webRoot, receivedFile));
    const expected = readTextFileSync(path.join(absTestPath, PATHS.expected, expectedFile));
    expect(received).toEqual(expected);
    done();
  });
};

export const compareTemplateFunction = (
  PATHS,
  relTestCasePath,
  done,
  receivedFile = 'index.js',
  expectedFile = 'index.html'
) => {
  const absTestPath = path.join(PATHS.testOutput, relTestCasePath);

  compile(PATHS, relTestCasePath, {}).then(() => {
    const received = execScriptSync(path.join(absTestPath, PATHS.webRoot, receivedFile));
    const expected = readTextFileSync(path.join(absTestPath, PATHS.expected, expectedFile));
    expect(received).toEqual(expected);
    done();
  });
};

export const exceptionContain = function (PATHS, relTestCasePath, containString, done) {
  compile(PATHS, relTestCasePath, {})
    .then(() => {
      throw new Error('the test should throw an error');
    })
    .catch((error) => {
      expect(error.toString()).toContain(containString);
      done();
    });
};