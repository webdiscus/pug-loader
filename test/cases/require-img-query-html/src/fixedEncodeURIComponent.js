// Original encodeURIComponent() function not support RFC 3986.
// See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent

/**
 * Note: in Pug is very important calling order, firstly replace missing chars then encode result.
 *
 * @param {string} str
 * @returns {string}
 */
const fixedEncodeURIComponent = (str) =>
  encodeURIComponent(str.replace(/[!'()*]/g, (c) => '%' + c.charCodeAt(0).toString(16)));

module.exports = fixedEncodeURIComponent;