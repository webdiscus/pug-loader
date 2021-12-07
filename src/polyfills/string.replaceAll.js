/**
 * Polyfill replaceAll() for node.js < 15.0.0.
 *
 * @dependency node.js >= 12
 *
 * @param {string} str The content where wll be replaced.
 * @param {string|RegExp} searchValue
 * @param {string|function} replacer
 * @return {string}
 */
const replaceAll = (str, searchValue, replacer) => {
  const pattern =
    Object.prototype.toString.call(searchValue).toLowerCase() === '[object regexp]'
      ? searchValue
      : new RegExp(searchValue, 'g');

  if (typeof replacer === 'string') {
    return str.replace(pattern, replacer);
  } else if (typeof replacer !== 'function') {
    throw new Error(
      'The replacement argument of replaceAll() must be a string or a function, but given: ' + JSON.stringify(replacer)
    );
  }

  let matches = str.matchAll(pattern),
    buff = [],
    start = 0,
    match,
    substr,
    newSubstr;

  for (match of matches) {
    substr = match[0];
    newSubstr = replacer(substr);
    buff.push(str.substring(start, match.index));
    buff.push(newSubstr);
    start = match.index + substr.length;
  }
  buff.push(str.substr(start));

  return buff.join('');
};

if (!String.prototype.replaceAll) {
  String.prototype.replaceAll = function (str, replacement) {
    return replaceAll(this, str, replacement);
  };
}

module.exports = replaceAll;
