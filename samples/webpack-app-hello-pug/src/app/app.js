const html = require('./app.pug');
const appRootId = 'app-root';

export function app() {
  const appRootContainer = document.getElementById(appRootId);
  appRootContainer.innerHTML = html();
}
