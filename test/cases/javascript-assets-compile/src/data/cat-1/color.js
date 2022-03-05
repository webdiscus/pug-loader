const Color = function () {};
Color.colors = [];

Color.getHelloColor = function (name = '') {
  const color = Color.find(name);
  const hex = color.hex || '';
  return `Hello ${name} (${hex})!`;
};

Color.getData = function () {
  return Color.colors;
};

Color.add = function (colors) {
  Color.colors = colors;
};

Color.find = function (name) {
  return Color.colors.find((item) => item.name === name);
};

module.exports = Color;