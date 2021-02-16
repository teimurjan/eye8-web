const chalk = require('chalk');

const green = (...args) => {
  console.log(chalk.green(...args));
};

const yellow = (...args) => {
  console.log(chalk.yellow(...args));
};

const red = (...args) => {
  console.log(chalk.red(...args));
};

const grey = (...args) => {
  console.log(chalk.grey(...args));
};

module.exports = {
  green,
  yellow,
  red,
  grey,
};
