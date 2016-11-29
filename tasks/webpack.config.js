import { join, basename, resolve } from 'path';
import webpack from 'webpack';
import autoprefixer from 'autoprefixer';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import glob from 'glob';

import pkg from '../package.json';

const hmrEntry = 'webpack-hot-middleware/client';

const debug = process.env.NODE_ENV === 'development';
const verbose = process.env.VERBOSE === '1';

const targetDir = 'min/';
const assetsPath = join(__dirname, '..', 'assets');
const targetPath = join(__dirname, '..', 'html', `${targetDir}`);

const extractCSS = new ExtractTextPlugin(`${pkg.name}.css`);

const plugins = {
  dev: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ],
  prod: [
    new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }),
    extractCSS,
  ],
};

const loaders = {
  dev: [
    {
      test: /\.scss/,
      loaders: [
        'style',
        'css?sourceMap',
        'postcss',
        'sass?modules&localIdentName=[name]_[local]_[hash:base64:3]',
      ],
    },
  ],
  prod: [
    {
      test: /\.scss/,
      loader: extractCSS.extract('style', [
        'css',
        'postcss',
        'sass?minimize&modules&localIdentName=[name]_[local]_[hash:base64:3]',
      ]),
    },
  ],
}

const entries = {
  main: [ './src/index.js' ]
};

glob.sync(join(assetsPath, 'scss', '*.scss'), { ignore: '**/_*.scss' })
  .forEach((filename) => {
    entries.main.push(filename);
  });

if (debug) {
  entries.main.unshift(hmrEntry);
}

export default {
  entry: entries,

  debug,
  devtool: debug ? '#inline-source-map' : false,

  context: assetsPath,

  output: {
    filename: `${pkg.name}.js`,
    path: targetPath,
    publicPath: `/${targetDir}`,
  },

  resolve: {
    modulesDirectories: ['node_modules'],
    extensions: ['', '.js', '.json', '.jsx'],
  },

  externals: [],

  module: {
    loaders: [
      { test: /\.json$/, loader: 'json' },
      {
        test: /\.jsx?$/,
        loader: 'babel',
        exclude: /node_modules/,
      },
      {
        test: /\.(ttf|eot|woff2?)($|\?)/,
        loader: `url${debug ? '' : '?limit=10000'}`
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        loader: 'url',
        exclude: /favicon\.png$/,
      },
      {
        test: /favicon\.png$/,
        loader: 'file'
      },
    ].concat(loaders[debug ? 'dev' : 'prod'])
  },

  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: `"${process.env.NODE_ENV}"` },
      DEBUG: debug,
    }),
  ].concat(plugins[debug ? 'dev' : 'prod']),

  postcss: () => [autoprefixer],

  sassLoader: {
    includePaths: [resolve(__dirname, '../node_modules')],
  },

  stats: {
    assetsByChunkName: true,
    colors: true,
    reasons: true,
    hash: true,
    version: verbose,
    timings: true,
    chunks: verbose,
    chunkModules: verbose,
    cached: verbose,
    cachedAssets: verbose,
  },
};
