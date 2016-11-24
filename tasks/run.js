import { join } from 'path';
import Ora from 'ora';

async function run(func, options) {
  const spinner = new Ora(func.name);
  try {
    spinner.start();
    await func(options);
    spinner.succeed();
  } catch (err) {
    spinner.fail();
    console.error(err);
    throw err;
  }
}

function format(time) {
  return time.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1');
}

if (module.parent === null && process.argv.length > 2) {
  delete require.cache[__filename]; // eslint-disable-line no-underscore-dangle
  const module = process.argv[2];

  const filename = join(__dirname, `${module}.js`); // eslint-disable-line no-underscore-dangle
  const func = require(filename); // eslint-disable-line global-require

  run(func).catch(err => console.error(err.stack));
}

export default run;
