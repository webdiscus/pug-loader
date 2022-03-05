const ansis = require('ansis');
const { loaderName } = require('./utils');

let lastError = null;

/**
 * @param {string} message
 * @constructor
 */
const PugLoaderException = function (message) {
  this.name = 'PugLoaderException';
  this.message = message;
  this.toString = () => this.message;
};

/**
 * @param {string} message The error description.
 * @param {PugLoaderException|Error|string?} error The original error from catch()
 * @constructor
 */
const PugLoaderError = function (message, error = '') {
  if (error && error instanceof PugLoaderException) {
    if (error.toString() === lastError) {
      // prevent double output same error
      throw new PugLoaderException(lastError);
    }
    // throw original error to avoid output all nested exceptions
    lastError = error.toString();
    throw new Error(lastError);
  }
  lastError = message + `\n` + error;
  throw new PugLoaderException(lastError);
};

/**
 * @param {PugLoaderException|Error} error The original error.
 * @param {string} file The resource file.
 * @param {string} templateFile The template file.
 * @throws {Error}
 */
const resolveException = (error, file, templateFile) => {
  const message =
    `\n${ansis.black.bgRedBright(`[${loaderName}]`)} the file ${ansis.yellow(
      file
    )} can't be resolved in the pug template:\n` + ansis.cyan(templateFile);

  PugLoaderError(message, error);
};

/**
 * @param {string} value The value to interpolate.
 * @param {string} templateFile The template file.
 * @throws {Error}
 */
const unsupportedInterpolationException = (value, templateFile) => {
  const message =
    `\n${ansis.black.bgRedBright(`[${loaderName}]`)} the expression ${ansis.yellow(
      value
    )} can't be interpolated with the 'compile' method in the pug template: ${ansis.cyan(templateFile)}\n` +
    `${ansis.yellow(
      'Possible solution: '
    )} Try to use the loader option 'method' as 'render' or change your dynamic filename to static or use webpack alias instead of alias from tsconfig.`;

  PugLoaderError(message, '');
};

/**
 * @param {PugLoaderException|Error} error The original error.
 * @param {string} sourceFile
 * @throws {Error}
 */
const executeTemplateFunctionException = (error, sourceFile) => {
  const message =
    `\n${ansis.black.bgRedBright(`[${loaderName}]`)} Failed to execute template function.\n` +
    `${ansis.red.bold(`Template file:`)} ${ansis.cyan(sourceFile)}\n` +
    `${ansis.red.bold(`Possible reason:`)} in the template may be used undefined variable.\n` +
    `${ansis.black.bgYellow(`Solution`)} in this case pass a variable into a pug file via the query parameter.\n` +
    `For example, if in pug is used the external variable, like ${ansis.yellow(`title= customData.options.title`)},\n` +
    `then pass it into pug ${ansis.magenta(
      `'template.pug?customData=' + JSON.stringify({options:{title:'My title'}})`
    )}`;

  PugLoaderError(message, error);
};

/**
 * @param {string} error
 * @returns {string}
 */
const getPugCompileErrorMessage = (error) => {
  return `\n${ansis.black.bgRedBright(`[${loaderName}]`)} Pug compilation failed.\n` + error.toString();
};

module.exports = {
  PugLoaderError,
  resolveException,
  unsupportedInterpolationException,
  executeTemplateFunctionException,
  getPugCompileErrorMessage,
};
