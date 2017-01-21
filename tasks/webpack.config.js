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
    new webpack.NoEmitOnErrorsPlugin(),
  ],
  prod: [
    new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }),
    extractCSS,
  ],
};

const rules = {
  dev: [
    {
      test: /\.scss$/,
      use: [
        {
          loader: 'style-loader',
        },
        {
          loader: 'css-loader',
          query: {
            camelCase: true,
            sourceMap: true,
          }
        },
        {
          loader: 'postcss-loader',
          query: {
            sourceMap: true,
          }
        },
        {
          loader: 'sass-loader',
          query: {
            sourceMap: true,
            modules: true,
            localIdentName: '[name]_[local]_[hash:base64:3]',
          },
        },
      ],
    },
  ],
  prod: [
    {
      test: /\.scss/,
      loader: extractCSS.extract({
        fallbackLoader: 'style-loader',
        loader: [
          {
            loader: 'css-loader',
            query: {
              camelCase: true,
            },
          },
          {
            loader: 'postcss-loader',
          },
          {
            loader: 'sass-loader',
            query: {
              minimize: true,
              modules: true,
              localIdentName: '[name]_[local]_[hash:base64:3]',
            },
          },
        ]
      }),
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

  devtool: debug ? 'cheap-module-eval-source-map' : false,

  context: assetsPath,

  output: {
    filename: `${pkg.name}.js`,
    path: targetPath,
    publicPath: `/${targetDir}`,
  },

  resolve: {
    extensions: ['.js', '.json', '.jsx'],
  },

  externals: [],

  module: {
    rules: [
      { test: /\.json$/, loader: 'json' },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(ttf|eot|woff2?)($|\?)/,
        loader: 'url-loader',
        query: {
          limit: debug ? '' : 10000,
        },
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        loader: 'url-loader',
        exclude: /favicon\.png$/,
      },
      {
        test: /favicon\.png$/,
        loader: 'file-loader'
      },
    ].concat(rules[debug ? 'dev' : 'prod'])
  },

  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: `"${process.env.NODE_ENV}"` },
      DEBUG: debug,
    }),
    new webpack.LoaderOptionsPlugin({
      debug,
      minimize: !debug,
      options: {
        context: '/',
        postcss: [autoprefixer],
        sassLoader: {
          includePaths: [resolve(__dirname, '../node_modules')],
        },
      },
    }),
  ].concat(plugins[debug ? 'dev' : 'prod']),

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
