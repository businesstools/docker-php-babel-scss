import webpack from 'webpack';
import autoprefixer from 'autoprefixer';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

import pkg from '../package.json';

const debug = process.env.NODE_ENV === 'development';
const verbose = process.env.VERBOSE === '1';

const assetsPath = __dirname + '/../html/assets';

const extractCSS = new ExtractTextPlugin('[name]-[hash:6].css');

const devPlugins = [];
const prodPlugins = [
  new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }),
  extractCSS,
];


export default {
  entry: [
    './src/index.js',
    './scss',
  ],

  debug,
  cache: debug,
  devtool: debug ? '#inline-source-map' : false,

  context: assetsPath,

  output: {
    filename: `lib/${pkg.name}.js`,
    path: assetsPath,
    // publicPath: '/',
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
      debug ? {
        test: /\.scss/,
        loaders: [
          'style',
          'css?sourceMap',
          'postcss',
          'sass?sourceMap&modules&localIdentName=[name]_[local]_[hash:base64:3]',
        ]
      } : {
        test: /\.scss/,
        loader: extractCSS.extract('style', [
          'css',
          'postcss',
          'sass?minimize&modules&localIdentName=[name]_[local]_[hash:base64:3]',
        ])
      },
    ]
  },

  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: `"${process.env.NODE_ENV}"` },
      DEBUG: debug,
    }),
  ].concat(debug ? devPlugins : prodPlugins),

  postcss: () => [autoprefixer],

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
