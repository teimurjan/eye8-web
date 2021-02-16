const execa = require('execa');

const print = require('./print');

const runSync = (command, args, options) => {
  try {
    print.grey([command, ...args].join(' '));

    const result = execa.sync(command, args, {
      stdio: 'inherit',
      ...options,
    });

    console.log('Done.');

    return result;
  } catch (e) {
    print.red(e);

    if (e.exitCode && e.exitCode !== 0) {
      process.exit(e.exitCode);
    }
  }
};

module.exports = runSync;
