const { isWin } = require('./Utils');
const path = require('path');

// TODO: after changes recompile JS files imported in `main.js`, which is in defined script tag.
//   For example, change the examples/hello-world-app/src/app/App.js:
//   - first changes -> live reload -> display changes
//   - next changes -> live reload -> display first changes (possible required file is cached)

/**
 * Dependencies in code for watching a changes.
 * @singleton
 */
class Dependency {
  files = new Set();
  watchFiles = [/\.(pug|jade|js.{0,2}|.?js|ts.?|md|txt)$/i];
  loaderContext = null;
  isInit = false;

  init({ loaderContext, watchFiles }) {
    // avoid double push in array by watching
    if (!this.isInit && watchFiles != null) {
      if (!Array.isArray(watchFiles)) watchFiles = [watchFiles];
      this.watchFiles.push(...watchFiles);
      this.isInit = true;
    }
    this.loaderContext = loaderContext;
  }

  /**
   * Add file to watch list.
   *
   * @param {string} file
   */
  add(file) {
    if (!this.watchFiles.find((regex) => regex.test(file))) {
      return;
    }

    file = isWin ? path.normalize(file) : file;
    this.files.add(file);

    // delete the file from require.cache to reload cached files after changes by watch
    delete require.cache[file];
  }

  /**
   * Enable Webpack watching for dependencies.
   */
  watch() {
    const { loaderContext } = this;
    const files = Array.from(this.files);

    if (loaderContext != null) {
      files.forEach(loaderContext.addDependency);
    }
  }
}

module.exports = new Dependency();
