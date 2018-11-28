'use strict'

module.exports = {
  './**/*.js': [
    'eslint ./ --fix -c ./eslint-config/node.js --max-warnings=0',
    'git add'
  ]
}
