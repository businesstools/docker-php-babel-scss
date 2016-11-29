import { join } from 'path';
import { remove } from 'fs-promise';
import glob from 'glob';

export default function clean() {
  return new Promise((resolve, reject) => {
    glob(join(__dirname, '..', 'html', '*.@(js|json|css)'), (err, files) => {
      if (err) {
        reject(err);
        return;
      }

      Promise.all(files.map(file => remove(file)))
        .then(resolve)
        .catch(reject);
    })
  });
}
