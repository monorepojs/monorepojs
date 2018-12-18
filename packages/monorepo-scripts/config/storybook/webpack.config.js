'use strict'

const { aliases } = require('../mono')
const { srcPaths } = require('../paths')

module.exports = (baseConfig, env, defaultConfig) => {
  // For example, add typescript loader:
  Object.assign(defaultConfig.resolve.alias, aliases)

  defaultConfig.module.rules[0].include = srcPaths
  defaultConfig.module.rules[0].exclude = [/[/\\\\]node_modules[/\\\\]/]
  defaultConfig.module.rules[0].use[0].options.babelrc = false
  defaultConfig.module.rules[0].use[0].options.configFile = false

  return defaultConfig
}
