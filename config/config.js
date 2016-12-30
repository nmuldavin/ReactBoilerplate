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
  path_base: path.resolve(__dirname, '..'),
  dir_client: 'src',
  dir_dist: 'dist',
  dir_server: 'server',
  dir_test: 'tests',

  /**
   * server config
   */
  server_host: ip.address(), // use string 'localhost' to prevent exposure on local network
  server_port: process.env.PORT || 3000,

  /**
   * Compiler Configuration
   */
  compiler_babel: {
    cacheDirectory: true,
    plugins: ['transform-runtime', 'react-hot-loader/babel'],
    presets: [['es2015', { modules: false }], 'react'],
  },
  compiler_devtool: 'source-map',
  compiler_hash_type: 'hash',
  compiler_fail_on_warning: false,
  compiler_quiet: false,
  compiler_public_path: '/',
  compiler_stats: {
    chunks: false,
    chunkModules: false,
    colors: true,
  },
  compiler_vendors: [
    'react',
    'react-redux',
    'react-router',
    'redux',
  ],

  /**
   * Compiler configuration
   */
  coverage_reporters: [
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

config.compiler_vendors = config.compiler_vendors
  .filter((dep) => {
    if (pkg.dependencies[dep]) {
      return true;
    }

    debug(
      `Package "${dep}" was not found as an npm dependency in package.json; ` +
      `it won't be included in the webpack vendor bundle.
       Consider removing it from \`compiler_vendors\` in ~/config/index.js`
    );
    return false;
  });

/**
 * Utilities
 */
function base(...rest) {
  const args = [config.path_base].concat(rest);
  return path.resolve(...args);
}

config.utils_paths = {
  base,
  client: base.bind(null, config.dir_client),
  dist: base.bind(null, config.dir_dist),
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
