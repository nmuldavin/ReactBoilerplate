const webpack = require('webpack');
const debug = require('debug')('app:build:webpack-compile');
const config = require('../config/config.js');

function webpackCompiler(webpackConfig, statsFormatSpec) {
  const statsFormat = statsFormatSpec || config.compilerStats;

  return new Promise((resolve, reject) => {
    const compiler = webpack(webpackConfig);

    compiler.run((err, stats) => {
      if (err) {
        debug('Webpack compiler encountered a fatal error.', err);
        return reject(err);
      }

      const jsonStats = stats.toJson();
      debug('Webpack compile completed.');
      debug(stats.toString(statsFormat));

      if (jsonStats.errors.length > 0) {
        debug('Webpack compiler encountered errors.');
        debug(jsonStats.errors.join('\n'));
        return reject(new Error('Webpack compiler encountered errors'));
      } else if (jsonStats.warnings.length > 0) {
        debug('Webpack compiler encountered warnings.');
        debug(jsonStats.warnings.join('\n'));
      } else {
        debug('No errors or warnings encountered.');
      }
      return resolve(jsonStats);
    });
  });
}

module.exports = webpackCompiler;
