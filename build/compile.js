const fs = require('fs-extra');
const debug = require('debug')('app:build:compile');
const webpackCompiler = require('./webpackCompiler.js');
const webpackConfig = require('../config/webpack.config.js');
const config = require('../config/config.js');

const paths = config.utilsPaths;

const compile = () => {
  debug('Starting compiler.');
  return Promise.resolve()
    .then(() => webpackCompiler(webpackConfig))
    .then((stats) => {
      if (stats.warnings.length && config.compilerFailOnWarning) {
        throw new Error('Config set to fail on warning, exiting with status code "1".');
      }
      debug('Copying static assets to dist folder.');
      fs.copySync(paths.client('static'), paths.dist());
    })
    .then(() => {
      debug('Compilation completed successfully.');
    })
    .catch((err) => {
      debug('Compiler encountered an error.', err);
      process.exit(1);
    });
};

compile();
