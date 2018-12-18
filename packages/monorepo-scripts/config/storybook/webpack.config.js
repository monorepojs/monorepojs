'use strict'

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development'
process.env.NODE_ENV = 'development'

// Ensure environment variables are read.
require('../env')

const { aliases } = require('../mono')
const { srcPaths } = require('../paths')

module.exports = (baseConfig, env, defaultConfig) => {
  // For example, add typescript loader:
  Object.assign(defaultConfig.resolve.alias, aliases)

  defaultConfig.module.rules[0].include = srcPaths
  defaultConfig.module.rules[0].exclude = [/[/\\\\]node_modules[/\\\\]/]
  defaultConfig.module.rules[0].use[0].options.plugins.push(
    '@babel/plugin-syntax-dynamic-import'
  )
  defaultConfig.module.rules[0].use[0].options.babelrc = false
  defaultConfig.module.rules[0].use[0].options.configFile = false

  return defaultConfig
}
