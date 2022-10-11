/**
 * Store of script files from `script` tag for sharing with pug-plugin.
 * @singleton
 */

class ScriptStore {
  constructor() {
    this.files = [];
  }

  init({ issuer }) {
    this.issuer = issuer;
  }

  /**
   * @param {string} file
   * @return {boolean}
   */
  has(file) {
    return this.files.find((item) => item.file === file) != null;
  }

  /**
   * @param {string} request The required resource file.
   */
  add(request) {
    const [file] = request.split('?', 1);

    // one issuer can have many scripts, one script can be in many issuers
    this.files.push({
      name: undefined,
      file,
      issuer: {
        filename: undefined,
        request: this.issuer,
      },
    });
  }

  /**
   * @param {string} name The unique name of entry point.
   * @param {string} file The source file of script.
   * @param {Set} issuers The issuer source files of the required file. One script can be used in many templates.
   */
  setName(name, file, issuers) {
    for (let item of this.files) {
      if (!item.name && item.file === file && issuers.has(item.issuer.request)) {
        item.name = name;
      }
    }
  }

  /**
   * @param {string} issuer The source file of issuer of the required file.
   * @param {string} filename The output asset filename of issuer.
   */
  setIssuerFilename(issuer, filename) {
    for (let item of this.files) {
      if (item.issuer.request === issuer) {
        item.issuer.filename = filename;
      }
    }
  }

  getAll() {
    return this.files;
  }

  reset() {
    this.files = [];
  }

  clear() {
    this.files = [];
  }
}

module.exports = new ScriptStore();
