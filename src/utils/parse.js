const { merge } = require('webpack-merge');

const isJSON = (str) => typeof str === 'string' && str.length > 1 && str[0] === '{' && str[str.length - 1] === '}';

const parseValue = (value) => (isJSON(value) ? JSON.parse(value) : value == null ? '' : value);

/**
 * Parse the resourceQuery of the Loader Context.
 * See possible resource queries in the test case `parse resource data`.
 *
 * @param {string} query
 * @return {{}}
 */
const parseResourceData = function (query) {
  let params = query.split('&'),
    data = {};

  params.forEach((param) => {
    if (isJSON(param)) {
      const val = JSON.parse(param);
      data = merge(data, val);
      return;
    }

    let [key, val] = param.split('=');
    if (key.indexOf('[]') > 0) {
      key = key.replace('[]', '');
      if (!data.hasOwnProperty(key)) data[key] = [];
      data[key].push(parseValue(val));
    } else if (key && key.length > 0) {
      data[key] = parseValue(val);
    }
  });

  return data;
};

module.exports = parseResourceData;
