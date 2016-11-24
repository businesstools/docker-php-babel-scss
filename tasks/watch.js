// "build": "node-sass --include-path node_modules/normalize-scss/sass --output-style compressed -o html/assets/css html/assets/scss/snooze.scss",
import webpack from 'webpack';
import webpackConfig from './webpack.config';

export default function watch() {
  webpack({ ...webpackConfig, watch: true }, (err, stats) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log(stats.toString(webpackConfig.stats));
  });
}
