const argv = require('yargs').argv;
const webpack = require('webpack');
const cssnano = require('cssnano');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const config = require('./config');
const debug = require('debug')('app:config:webpack');

const paths = config.utilsPaths;
const ENV_DEV = config.globals.ENV_DEV;
const ENV_PROD = config.globals.ENV_PROD;
const ENV_TEST = config.globals.ENV_TEST;

debug('Creating configuration.');
const webpackConfig = {
  name: 'client',
  target: 'web',
  devtool: config.compilerDevtool,
  resolve: {
    modules: [paths.client(), 'node_modules'],
    extensions: ['.js', '.jsx', '.json'],
  },
  module: {},
  // shut up about bundle size when it's not minified
  performance: { hints: ENV_PROD ? 'warning' : false },
};
// ------------------------------------
// Entry Points
// ------------------------------------
const APP_ENTRY = paths.client('main.js');
const HOT_ENTRY = paths.client('hotReload.js');
const REACT_HOT_PATCH = 'react-hot-loader/patch';

webpackConfig.entry = {
  app: (ENV_DEV ?
    [REACT_HOT_PATCH, HOT_ENTRY] :
    [APP_ENTRY]).concat(`webpack-hot-middleware/client?path=${config.compilerPublicPath}__webpack_hmr`),
  vendor: config.compilerVendors,
};

// ------------------------------------
// Bundle Output
// ------------------------------------
webpackConfig.output = {
  filename: `[name].[${config.compilerHashType}].js`,
  path: paths.dist(),
  publicPath: config.compilerPublicPath,
};

// ------------------------------------
// Externals
// ------------------------------------
webpackConfig.externals = [
  'react/lib/ExecutionEnvironment',
  'react/lib/ReactContext',
  'react/addons',
];

// ------------------------------------
// Plugins
// ------------------------------------
webpackConfig.plugins = [
  new webpack.DefinePlugin(config.globals),
  new webpack.LoaderOptionsPlugin({
    options: {
      context: __dirname,
      postcss: [
        cssnano({
          autoprefixer: {
            add: true,
            remove: true,
            browsers: ['last 2 versions'],
          },
          discardComments: {
            removeAll: true,
          },
          discardUnused: false,
          mergeIdents: false,
          reduceIdents: false,
          safe: true,
          sourcemap: true,
        }),
      ],
      sassLoader: {
        includePaths: paths.client('styles'),
      },
    },
  }),
  new HtmlWebpackPlugin({
    template: paths.client('index.html'),
    hash: false,
    // favicon: paths.client('static/favicon.ico'),
    filename: 'index.html',
    inject: 'body',
    minify: {
      collapseWhitespace: true,
    },
  }),
];

// Ensure that the compiler exits on errors during testing so that
// they do not get skipped and misreported.
if (ENV_TEST && !argv.watch) {
  webpackConfig.plugins.push(() => {
    this.plugin('done', (stats) => {
      const errors = [];
      if (stats.compilation.errors.length) {
        // Log each of the warnings
        stats.compilation.errors.forEach((error) => {
          errors.push(error.message || error);
        });

        // Pretend no assets were generated. This prevents the tests
        // from running making it clear that there were warnings.
        throw new Error(errors);
      }
    });
  });
}

if (ENV_DEV) {
  debug('Enable plugins for live development (HMR, NoErrors).');
  webpackConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  );
} else if (ENV_PROD) {
  debug('Enable plugins for production (OccurenceOrder, UglifyJS).');
  webpackConfig.plugins.push(
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        unused: true,
        dead_code: true,
        warnings: false,
      },
    })
  );
}

// Don't split bundles during testing, since we only want import one bundle
if (!ENV_TEST) {
  webpackConfig.plugins.push(
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor'],
    })
  );
}

// ------------------------------------
// Loaders
// ------------------------------------
// JavaScript / JSON
webpackConfig.module.loaders = [{
  test: /\.(js|jsx)$/,
  exclude: /node_modules/,
  loader: 'babel-loader',
  query: config.babelConfig,
}, {
  test: /\.json$/,
  loader: 'json-loader',
}];

// ------------------------------------
// Style Loaders
// ------------------------------------
// We use cssnano with the postcss loader, so we tell
// css-loader not to duplicate minimization.
const BASE_CSS_LOADER = 'css-loader?sourceMap&-minimize';

webpackConfig.module.loaders.push({
  test: /\.scss$/,
  loaders: [
    'style-loader',
    BASE_CSS_LOADER,
    'postcss-loader',
    'sass-loader?sourceMap',
  ],
});
webpackConfig.module.loaders.push({
  test: /\.css$/,
  loaders: [
    'style-loader',
    BASE_CSS_LOADER,
    'postcss-loader',
  ],
});

// File loaders
/* eslint-disable */
webpackConfig.module.loaders.push(
  { test: /\.woff(\?.*)?$/,  loader: 'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff' },
  { test: /\.woff2(\?.*)?$/, loader: 'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff2' },
  { test: /\.otf(\?.*)?$/,   loader: 'file-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=font/opentype' },
  { test: /\.ttf(\?.*)?$/,   loader: 'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/octet-stream' },
  { test: /\.eot(\?.*)?$/,   loader: 'file-loader?prefix=fonts/&name=[path][name].[ext]' },
  { test: /\.svg(\?.*)?$/,   loader: 'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=image/svg+xml' },
  { test: /\.(png|jpg)$/,    loader: 'url-loader?limit=8192' }
);


// ------------------------------------
// Finalize Configuration
// ------------------------------------
// when we don't know the public path (we know it only when HMR is enabled [in development]) we
// need to use the extractTextPlugin to fix this issue:
// http://stackoverflow.com/questions/34133808/webpack-ots-parsing-error-loading-fonts/34133809#34133809
if (!ENV_DEV) {
  debug('Apply ExtractTextPlugin to CSS loaders.');
  webpackConfig.module.loaders.filter(loader =>
    loader.loaders && loader.loaders.find(name => /css/.test(name.split('?')[0]))
  ).forEach((loader) => {
    const first = loader.loaders[0];
    const rest = loader.loaders.slice(1);
    loader.loader = ExtractTextPlugin.extract({
      fallbackLoader: first,
      loader: rest.join('!'),
    });
    delete loader.loaders;
  });

  /* eslint-enable */
  webpackConfig.plugins.push(
    new ExtractTextPlugin({
      filename: '[name].[contenthash].css',
      allChunks: true,
    })
  );
}

module.exports = webpackConfig;
