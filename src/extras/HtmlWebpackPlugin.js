/**
 * Supports for user options in html-webpack-plugin.
 *
 * @type {{userOptions(Object, string): {htmlWebpackPlugin: {options: {}}}}}
 */

const HtmlWebpackPlugin = {
  /**
   * Return user options.
   *
   * @param {Object} webpackOptions The webpack config options.
   * @param {string} filename The filename of pug template.
   * @returns {{htmlWebpackPlugin: {options: {}}}}
   */
  userOptions(webpackOptions, filename) {
    const plugins = webpackOptions.plugins;
    let options = {};

    if (plugins) {
      const pluginData = plugins.find(
        (item) => item.constructor.name === 'HtmlWebpackPlugin' && item.options.template.indexOf(filename) >= 0
      );

      if (pluginData) {
        options = { htmlWebpackPlugin: { options: {} } };

        if (pluginData.hasOwnProperty('userOptions')) {
          options.htmlWebpackPlugin.options = pluginData.userOptions;
        }
      }
    }

    return options;
  },
};

module.exports = HtmlWebpackPlugin;
