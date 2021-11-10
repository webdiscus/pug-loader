const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webRootPath = path.join(__dirname, '/public/');

const prepareWebpackConfig = (PATHS, relTestCasePath, webpackOpts = {}) => {
  const testPath = path.join(PATHS.testOutput, relTestCasePath),
    webRootPath = path.join(testPath, PATHS.webRoot),
    outputPath = path.join(webRootPath, PATHS.output),
    configFile = path.join(testPath, 'webpack.config.js'),
    commonConfigFile = path.join(PATHS.base, 'webpack.common.js');

  if (!fs.existsSync(configFile)) {
    throw new Error(`The config file '${configFile}' not found for test: ${relTestCasePath}`);
  }

  let baseConfig = {
      // the home directory for webpack should be the same where the tested webpack.config.js located
      context: testPath,
      output: {
        path: outputPath,
      },
    },
    testConfig = require(configFile),
    commonConfig = require(commonConfigFile);

  // remove module rules in common config when custom rules are defined by test config or options
  if ((webpackOpts.module && webpackOpts.module.rules) || (testConfig.module && testConfig.module.rules)) {
    commonConfig.module.rules = [];
  }

  return merge(baseConfig, commonConfig, webpackOpts, testConfig);
};

export const compile = (PATHS, testCasePath, webpackOpts) => {
  let config;

  try {
    config = prepareWebpackConfig(PATHS, testCasePath, webpackOpts);
  } catch (e) {
    throw new Error(e.toString());
  }

  const compiler = webpack(config);

  return new Promise((resolve) => {
    compiler.run((error, stats) => {
      if (error) throw new Error('[webpack compiler] ' + error);
      if (stats.hasErrors()) throw new Error('[webpack compiler stats] ' + stats.toString());

      resolve(stats);
    });
  });
};

export const compileTemplate = (PATHS, testCasePath, template, webpackOpts = {}) => {
  let config;

  webpackOpts['plugins'] = [
    new HtmlWebpackPlugin({
      filename: path.join(__dirname, '../output/', testCasePath, '/public/index.html'),
      template: template,
      inject: false,
    }),
  ];

  try {
    config = prepareWebpackConfig(PATHS, testCasePath, webpackOpts);
  } catch (e) {
    throw new Error(e.toString());
  }

  const compiler = webpack(config);

  return new Promise((resolve) => {
    compiler.run((error, stats) => {
      if (error) throw new Error('[webpack compiler] ' + error);
      if (stats.hasErrors()) throw new Error('[webpack compiler stats] ' + stats.toString());

      resolve(stats);
    });
  });
};