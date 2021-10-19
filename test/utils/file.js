const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Get files with relative paths.
 * @param {string} dir
 * @return {[]}
 */
export const readDirRecursiveSync = function (dir = './') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  dir = path.resolve(dir);

  // Get files within the current directory and add a path key to the file objects
  const files = entries.filter((file) => !file.isDirectory()).map((file) => path.join(dir, file.name));

  // Get folders within the current directory
  const folders = entries.filter((folder) => folder.isDirectory());

  for (const folder of folders) {
    files.push(...readDirRecursiveSync(path.join(dir, folder.name)));
  }

  return files;
};

/**
 * Copy recursive, like as `cp -R`.
 * @param {string} src The path to the thing to copy.
 * @param {string} dest The path to the new copy.
 */
export const copyRecursiveSync = function (src, dest) {
  if (!fs.existsSync(src)) throw new Error(`The source '${src}' not found `);

  let stats = fs.statSync(src),
    isDirectory = stats.isDirectory();

  if (isDirectory) {
    fs.mkdirSync(dest);
    fs.readdirSync(src).forEach((dir) => {
      copyRecursiveSync(path.join(src, dir), path.join(dest, dir));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
};

/**
 * Return object of JSON file.
 *
 * @param {string} file
 * @return {any}
 */
export const readJsonSync = (file) => {
  const content = fs.readFileSync(file, 'utf-8');
  return JSON.parse(content);
};

/**
 * Return content of file as string.
 *
 * @param {string} file
 * @return {any}
 */
export const readTextFileSync = (file) => {
  return fs.readFileSync(file, 'utf-8');
};

/**
 * Return output of javascript file.
 *
 * @param {string} file
 * @return {any}
 */
export const execScriptSync = (file) => {
  const result = execSync('node ' + file);
  // replace last newline in result
  return result.toString().replace(/\n$/, '');
};

export const getCompareFiles = function (PATHS, absTestPath, file, manifest) {
  let sourceFile = path.join(PATHS.output, file);
  let expectedFile = path.join(PATHS.expected, file);
  let targetFile = manifest[sourceFile] || sourceFile;
  let received = readTextFileSync(path.join(absTestPath, PATHS.webRoot, targetFile));
  let expected = readTextFileSync(path.join(absTestPath, expectedFile));

  return {
    received: received,
    expected: expected,
  };
};