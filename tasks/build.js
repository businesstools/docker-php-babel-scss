// "build": "node-sass --include-path node_modules/normalize-scss/sass --output-style compressed -o html/assets/css html/assets/scss/snooze.scss",
import webpack from 'webpack';
import webpackConfig from './webpack.config';

export default function build() {
  return new Promise((resolve, reject) => {
    webpack(webpackConfig, (err, stats) => {
      if (err) {
        reject(err);
        return;
      }

      const info = stats.toJson();

      if (stats.hasErrors()) {
        reject(info.errors[0]);
        return;
      }

      if (webpackConfig.stats.assetsByChunkName) {
        resolve(stats.toJson(webpackConfig.stats).assetsByChunkName);
      } else {
        resolve();
      }
    });
  });
}
