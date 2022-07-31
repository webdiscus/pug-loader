/**
 * The share point between pug-plugin and pug-loader instances.
 *
 * @singleton
 */
class Plugin {
  used = false;

  /**
   * Set use state of pug-plugin.
   *
   * If pug-plugin is used, then this method will be called by pug-plugin initialisation
   * to disable some features of pug-plugin, because never used with pug-plugin,
   * but require additional compilation time.
   */
  init() {
    this.used = true;
  }

  /**
   * Whether is pug-plugin used.
   * @return {boolean}
   */
  isUsed() {
    return this.used;
  }

  /**
   * Reset states.
   * Used for tests to reset state after each test case.
   */
  reset() {
    this.used = false;
  }
}

module.exports = new Plugin();
