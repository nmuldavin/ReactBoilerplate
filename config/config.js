const path = require('path');
const debug = require('debug')('app:config');
const argv = require('yargs').argv;
const ip = require('ip');

debug('Creating default configuration.');
/**
 * Default Configuration
 */
const config = {
  env: process.env.NODE_ENV || 'development',

  /**
   * Project structure
   */
  basePath: path.resolve(__dirname, '..'),
  clientDir: 'src',
  distDir: 'dist',
  serverDir: 'server',
  testDir: 'tests',

  /**
   * server config
   */
  serverHost: ip.address(), // use string 'localhost' to prevent exposure on local network
  serverPort: process.env.PORT || 3000,

  /**
   * Compiler Configuration
   */
  babelConfig: {
    cacheDirectory: true,
    plugins: ['transform-runtime', 'react-hot-loader/babel'],
    presets: [['es2015', { modules: false }], 'react'],
  },
  compilerDevtool: 'source-map',
  compilerHashType: 'hash',
  compilerFailOnWarning: false,
  compilerQuiet: false,
  compilerPublicPath: '/',
  compilerStats: {
    chunks: false,
    chunkModules: false,
    colors: true,
  },
  compilerVendors: [
    'react',
    'most',
    'redux-most',
    'react-redux',
    'react-router',
    'redux',
  ],

  /**
   * Compiler configuration
   */
  coveragerReporters: [
    { type: 'text-summary' },
    { type: 'lcov', dir: 'coverage' },
  ],
};

/**
 * environment
 * NOTE: globals added here must also be added to .eslintrc
 */
config.globals = {
  'process.env': {
    NODE_ENV: JSON.stringify(config.env),
  },
  NODE_ENV: config.env,
  ENV_DEV: config.env === 'development',
  ENV_PROD: config.env === 'production',
  ENV_TEST: config.env === 'test',
  REPORT_COVERAGE: !argv.watch && config.env === 'test',
  GLOBAL_BASENAME: JSON.stringify(process.env.BASENAME || ''),
};

/**
 * Validate vendor dependencies
 */
const pkg = require('../package.json');

config.compilerVendors = config.compilerVendors
  .filter((dep) => {
    if (pkg.dependencies[dep]) {
      return true;
    }

    debug(
      `Package "${dep}" was not found as an npm dependency in package.json; ` +
      `it won't be included in the webpack vendor bundle.
       Consider removing it from \`compilerVendors\` in ~/config/index.js`
    );
    return false;
  });

/**
 * Utilities
 */
const base = (...rest) => {
  const args = [config.basePath].concat(rest);
  return path.resolve(...args);
};

config.utilsPaths = {
  base,
  client: base.bind(null, config.clientDir),
  dist: base.bind(null, config.distDir),
};

/**
 * Environment specific configuration
 */
debug(`Looking for environment overrides for NODE_ENV "${config.env}".`);
const environments = require('./environments.js');

const overrides = environments[config.env];
if (overrides) {
  debug('Found overrides, applying to default configuration.');
  Object.assign(config, overrides(config));
} else {
  debug('No environment overrides found, defaults will be used.');
}

module.exports = config;
