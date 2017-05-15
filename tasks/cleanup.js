import { join } from 'path';
import rimraf from 'rimraf';

export default function cleanup() {
  return new Promise((resolve) => {
    rimraf(join(__dirname, '..', 'html', 'min'), resolve);
  });
}
