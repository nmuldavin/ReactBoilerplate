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
const HOT_APP_ENTRY = paths.client('hotReload.js');
const REACT_HOT_PATCH_ENTRY = 'react-hot-loader/patch';
const HOT_MIDDLEWARE_ENTRY = `webpack-hot-middleware/client?path=${config.compilerPublicPath}__webpack_hmr`;
const BABEL_POLYFILL_ENTRY = 'babel-polyfill';

const HOT_ENTRY_PATHS = [
  REACT_HOT_PATCH_ENTRY,
  HOT_APP_ENTRY,
  HOT_MIDDLEWARE_ENTRY,
];

const PROD_ENTRY_PATHS = [
  BABEL_POLYFILL_ENTRY,
  APP_ENTRY,
];

webpackConfig.entry = {
  app: (ENV_DEV ?
    HOT_ENTRY_PATHS :
    PROD_ENTRY_PATHS),
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
  webpackConfig.plugins.push(function pushPlugins() {
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
//
const babelLoader = {
  loader: 'babel-loader',
  options: config.babelConfig,
};

const styleLoader = 'style-loader';

const cssLoader = importLoaders => ({
  loader: 'css-loader',
  options: {
    sourceMap: true,
    modules: true,
    camelCase: true,
    importLoaders,
  },
});

const sassLoader = {
  loader: 'sass-loader',
  options: {
    sourceMap: true,
    includePaths: [
      paths.scss(),
    ],
  },
};

const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    plugins: [
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
  },
};

const wrapExtractText = ([fallback, ...use]) => {
  if (ENV_DEV) {
    return [fallback, ...use];
  }

  return ExtractTextPlugin.extract({
    fallback,
    use,
  });
};

webpackConfig.module.rules = [
  {
    test: /\.(js|jsx)$/,
    use: babelLoader,
    exclude: /node_modules/,
  },
  {
    test: /\.css$/,
    loaders: wrapExtractText([
      styleLoader,
      cssLoader(1),
      postcssLoader,
    ]),
  },
  {
    test: /\.scss$/,
    loaders: wrapExtractText([
      styleLoader,
      cssLoader(2),
      postcssLoader,
      sassLoader,
    ]),
  },
  {
    test: /\.woff(\?.*)?$/,
    use: 'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff',
  },
  {
    test: /\.woff2(\?.*)?$/,
    use: 'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff2',
  },
  {
    test: /\.otf(\?.*)?$/,
    use: 'file-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=font/opentype',
  },
  {
    test: /\.ttf(\?.*)?$/,
    use: 'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/octet-stream',
  },
  {
    test: /\.eot(\?.*)?$/,
    use: 'file-loader?prefix=fonts/&name=[path][name].[ext]',
  },
  {
    test: /\.svg(\?.*)?$/,
    use: 'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=image/svg+xml',
  },
  {
    test: /\.(png|jpg)$/,
    use: 'url-loader?limit=8192',
  },
];

// ------------------------------------
// Finalize Configuration
// ------------------------------------
// when we don't know the public path (we know it only when HMR is enabled [in development]) we
// need to use the extractTextPlugin to fix this issue:
// http://stackoverflow.com/questions/34133808/webpack-ots-parsing-error-loading-fonts/34133809#34133809
if (!ENV_DEV) {
  webpackConfig.plugins.push(
    new ExtractTextPlugin({
      filename: '[name].[contenthash].css',
      allChunks: true,
    })
  );
}

module.exports = webpackConfig;
