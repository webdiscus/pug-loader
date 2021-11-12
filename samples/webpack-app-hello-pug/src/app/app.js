const html = require('./app.pug');
const appRootSelector = '#app-root';

export function app() {
  const appRootContainer = document.getElementById(appRootSelector);
  appRootContainer.innerHTML = html;
}
