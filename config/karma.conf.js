const argv = require('yargs').argv;
const config = require('./config');
const webpackConfig = require('./webpack.config');
const debug = require('debug')('app:karma');

debug('Creating configuration.');
const karmaConfig = {
  basePath: '../', // project root in relation to bin/karma.js
  files: [
    {
      pattern: `./${config.testDir}/testBundler.js`,
      watched: false,
      served: true,
      included: true,
    },
  ],
  singleRun: !argv.watch,
  frameworks: ['mocha'],
  reporters: ['mocha'],
  preprocessors: {
    [`${config.testDir}/testBundler.js`]: ['webpack'],
  },
  browsers: ['PhantomJS'],
  webpack: {
    devtool: 'cheap-module-source-map',
    resolve: Object.assign({}, webpackConfig.resolve, {
      alias: Object.assign({}, webpackConfig.resolve.alias, {
        sinon: 'sinon/pkg/sinon.js',
      }),
    }),
    plugins: webpackConfig.plugins,
    performance: { hints: false },
    module: {
      noParse: [
        /\/sinon\.js/,
      ],
      loaders: webpackConfig.module.loaders.concat([
        {
          test: /sinon(\\|\/)pkg(\\|\/)sinon\.js/,
          loader: 'imports-loader?define=>false,require=>false',
        },
      ]),
    },
    // Enzyme fix, see:
    // https://github.com/airbnb/enzyme/issues/47
    externals: Object.assign({}, webpackConfig.externals, {
      'react/addons': true,
      'react/lib/ExecutionEnvironment': true,
      'react/lib/ReactContext': 'window',
    }),
  },
  webpackMiddleware: {
    noInfo: true,
  },
  coverageReporter: {
    reporters: config.coverageReporters,
  },
};

if (config.globals.REPORT_COVERAGE) {
  karmaConfig.reporters.push('coverage');
  karmaConfig.webpack.module.loaders.push({
    enforce: 'pre',
    test: /\.(js|jsx)$/,
    include: new RegExp(config.clientDir),
    exclude: /(node_modules|\.spec\.js$)/,
    loader: 'babel-loader',
    query: Object.assign({}, config.babelConfig, {
      plugins: (config.babelConfig.plugins || []).concat('istanbul'),
    }),
  });
}

module.exports = cfg => cfg.set(karmaConfig);
