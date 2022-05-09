/**
 * The filter `:escape` escapes HTML tags in pug.
 *
 * Note: the filename w/o ext is the filter name.
 *
 * Usage:
 *
 *  pre: code
 *    :escape
 *      <a href="home.html">Home</a>
 */

// Add the filter `escape` in the options of pug loader:
// {
//   test: /\.pug$/,
//   loader: '@webdiscus/pug-loader',
//   options: {
//     embedFilters: {
//       escape: true,
//     },
//   },
// },

module.exports = function escape(text, options) {
  return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
};
