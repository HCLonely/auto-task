const chalk = require('chalk')

const log = {
  success: function (...e) {
    console.log(chalk.green('[Success] ') + e.join(' '))
  },
  info: function (...e) {
    console.log(chalk.blue('[Info] ') + e.join(' '))
  },
  error: function (...e) {
    console.log(chalk.bold.red('[Error] ') + e.join(' '))
  },
  warning: function (...e) {
    console.log(chalk.keyword('orange')('[Warning] ') + e.join(' '))
  }
}

module.exports = log
