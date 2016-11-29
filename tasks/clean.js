import { join } from 'path';
import { remove } from 'fs-promise';

export default function clean() {
  return remove(join(__dirname, '..', 'html', 'min'));
}
