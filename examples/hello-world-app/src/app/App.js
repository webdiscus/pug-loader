// Demo of usage Pug templates in JavaScript

// use the `?pug-compile` query to load Pug file as a template function
import tmpl from './views/app.pug?pug-compile';

// load dummy data used in template
import colors from './colors.json';

class App {
  // application container element ID
  rootId = 'app-root';

  constructor() {}

  /**
   * Run application.
   *
   * @public
   */
  run() {
    this.render({ colors });
  }

  /**
   * Render application template.
   *
   * @param {object} locals The template variables.
   */
  render(locals) {
    const appRootContainer = document.getElementById(this.rootId);
    appRootContainer.innerHTML = tmpl(locals);
  }
}

export default new App();
