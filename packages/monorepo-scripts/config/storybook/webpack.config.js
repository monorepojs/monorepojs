'use strict'

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development'
process.env.NODE_ENV = 'development'

// Ensure environment variables are read.
require('../env')

const { aliases } = require('../mono')
const { srcPaths } = require('../paths')

module.exports = ({ config }) => {
  // For example, add typescript loader:
  Object.assign(config.resolve.alias, aliases)

  config.module.rules[0].include = srcPaths
  config.module.rules[0].exclude = [/[/\\\\]node_modules[/\\\\]/]
  config.module.rules[0].use[0].options.babelrc = false
  config.module.rules[0].use[0].options.configFile = false

  return config
}
