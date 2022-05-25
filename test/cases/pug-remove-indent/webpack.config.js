const path = require('path');
const PugPlugin = require('../../pug-plugin');

const webRootPath = path.join(__dirname, 'public/');

module.exports = {
  mode: 'production',

  output: {
    path: webRootPath,
    publicPath: '',
  },

  entry: {
    index: 'src/index.pug',
    'indent-2spaces-2nd-line': 'src/indent-2-spaces/indent-2nd-line.pug',
    'indent-4spaces-1st-line': 'src/indent-4-spaces/indent-1st-line.pug',
    'indent-4spaces-2nd-line': 'src/indent-4-spaces/indent-2nd-line.pug',
    'indent-tabs': 'src/indent-tabs/indent-2nd-line.pug',
  },

  plugins: [new PugPlugin()],

  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: 'pug-loader',
        options: {
          method: 'render',
        },
      },
    ],
  },
};