import { join } from 'path';
import webpack from 'webpack';
import webpackConfig from './webpack.config';
import express from 'express';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

export default function watch() {
  webpack({ ...webpackConfig, watch: true }, (err, stats) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log(stats.toString(webpackConfig.stats));
  });

  const compiler = webpack(webpackConfig);
  const app = express();

  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
    stats: { colors: true },
    watchOptions: {
      aggregateTimeout: 300,
    },
  }))

  app.use(webpackHotMiddleware(compiler, {
    log: console.log,
    reload: true,
  }));

  app.use(express.static(join(__dirname, '..', 'html')));

  app.get('/', (req, res, next) => {
    res.send(`<!doctype html><html><head></head><body><h1>:-)</h1>
      <script src="/min/bt-baseimage-php-babel-scss.js"></script>
      </body></html>`);
  })
  app.listen(8080);
}
