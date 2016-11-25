// "build": "node-sass --include-path node_modules/normalize-scss/sass --output-style compressed -o html/assets/css html/assets/scss/snooze.scss",
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
  }))
  app.use(webpackHotMiddleware(compiler));
  app.use(express.static(__dirname + '/../html/'));
  app.get('/', (req, res, next) => {
    res.send(`<!doctype html><html><head></head><body><h1>:-)</h1>
      <script src="/bt-baseimage-php-babel-scss.js"></script>
      </body></html>`);
  })
  app.listen(8080);
}
