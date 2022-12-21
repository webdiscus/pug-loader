const path = require('path');
const { red, green, cyan, yellow, black, blueBright } = require('ansis/colors');
const { labelWarn, outToConsole } = require('../Utils');

/**
 * Supports for user options of html-webpack-plugin.
 * @singleton
 */
class HtmlWebpackPlugin {
  used = null;

  reset() {
    this.used = null;
  }

  /**
   * Check whether HtmlWebpackPlugin is used in Webpack config.
   * Note: using this plugin is allowed for any HTML file, but not for Pug file.
   *
   * @return {null}
   */
  isUsed() {
    if (this.used == null) {
      this.used =
        this.plugins.find((item) => {
          if (item.constructor.name === 'HtmlWebpackPlugin') {
            const [templateFile] = item.options.template.split('?', 1);
            return templateFile.endsWith('.pug');
          }
          return false;
        }) != null;
    }

    return this.used;
  }

  /**
   * Return user options.
   *
   * @param {string} file The Pug absolute filename of Pug template.
   * @param {Object} webpackOptions The webpack config options.
   * @returns {{htmlWebpackPlugin: {options: {}}}}
   */
  getUserOptions(file, webpackOptions) {
    let options = {};
    this.plugins = webpackOptions.plugins || [];
    this.context = webpackOptions.context;

    if (this.isUsed()) {
      const pluginData = this.getOptions(file);
      if (pluginData) {
        options = { htmlWebpackPlugin: { options: {} } };
        if (pluginData.hasOwnProperty('userOptions')) {
          options.htmlWebpackPlugin.options = pluginData.userOptions;
        }

        this.deprecationWarning(file);
      }
    }

    return options;
  }

  /**
   * @param {string} file The Pug absolute filename of Pug template.
   * @return {any|null}
   * @private
   */
  getOptions(file) {
    return this.plugins.find(
      (item) => item.constructor.name === 'HtmlWebpackPlugin' && item.options.template.indexOf(file) >= 0
    );
  }

  /**
   * @param {string} request
   * @private
   */
  deprecationWarning(request) {
    const [file] = request.split('?', 1);
    const filename = path.relative(this.context, file);

    outToConsole(
      `${labelWarn()} ${black.bgYellow`DEPRECATION WARNING `} ` +
        `${yellow`Using ${red('html-webpack-plugin')} with Pug is deprecated!`}\n` +
        `The ${cyan(filename)} file is defined in webpack config by ${red('HtmlWebpackPlugin')}.\n` +
        `Use the ${green('pug-plugin')} instead of ${red('html-webpack-plugin')}.\n` +
        `For more information, see ${blueBright`https://github.com/webdiscus/pug-plugin`}.\n`
    );
  }
}

module.exports = new HtmlWebpackPlugin();
