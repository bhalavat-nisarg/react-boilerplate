/* eslint-disable no-console */

const chalk = require('chalk');
const os = require('os');

const divider = chalk.gray('\n-----------------------------------');

/**
 * Logger middleware, you can customize it to make messages more personal
 */
const logger = {
  // Called whenever there's an error on the server we want to print
  error: err => {
    console.error(chalk.red(err));
  },

  // Called when express.js app starts on given port w/o errors
  appStarted: (port, host) => {
    const addresses = Object.values(os.networkInterfaces())
      .reduce((all, entries) => all.concat(entries || []), [])
      .filter(entry => entry.family === 'IPv4' && !entry.internal);
    const lanAddress = addresses.length ? addresses[0].address : '127.0.0.1';
    console.log(`Server started ! ${chalk.green('✓')}`);

    console.log(`
${chalk.bold('Access URLs:')}${divider}
Localhost: ${chalk.magenta(`http://${host}:${port}`)}
      LAN: ${chalk.magenta(`http://${lanAddress}:${port}`)}${divider}
${chalk.blue(`Press ${chalk.italic('CTRL-C')} to stop`)}
    `);
  },
};

module.exports = logger;
