/**
 * The share point between pug-plugin and pug-loader instances.
 *
 * @singleton
 */
class Plugin {
  used = false;
  options = null;
  contextCache = new Set();

  /**
   * Set use state of pug-plugin.
   *
   * If pug-plugin is used, then this method will be called by pug-plugin initialisation
   * to disable some features of pug-plugin, because never used with pug-plugin,
   * but require additional compilation time.
   *
   * @param {{}} options The options of Pug plugin.
   */
  init(options) {
    this.used = true;
    this.options = options;
  }

  /**
   * Return a list of resolve restrictions to restrict the paths that a request can be resolved on.
   * @see https://webpack.js.org/configuration/resolve/#resolverestrictions
   * @return {Array<RegExp|string>}
   */
  getStyleRestrictions() {
    return this.options ? [this.options.extractCss.test] : [];
  }

  /**
   * Whether is pug-plugin used.
   * @return {boolean}
   */
  isUsed() {
    return this.used;
  }

  isCached(context) {
    if (this.contextCache.has(context)) return true;
    this.contextCache.add(context);

    return false;
  }

  /**
   * Reset states.
   * Used for tests to reset state after each test case.
   */
  reset() {
    this.used = false;
    this.contextCache.clear();
  }
}

module.exports = new Plugin();
