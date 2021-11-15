// Achtung: this is reserved for future features. Don't use it!
exports.pitch = async function (remaining) {
  console.log('+++ Asset Loader: ', this.resourcePath, ' === ', remaining);
  const result = await this.importModule(this.resourcePath + '.webpack[asset/resource]' + '!=!' + remaining);
  console.log('+++ Asset Loader RESULT: ', result);

  return result.default || result;
};
