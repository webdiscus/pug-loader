/**
 * Supports for user options of html-webpack-plugin.
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
}

module.exports = new HtmlWebpackPlugin();
