'use strict'
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin-alt')
const resolve = require('resolve')
const typescriptFormatter = require('react-dev-utils/typescriptFormatter')
const paths = require('../paths')

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
  Object.assign(config.resolve.extensions, [
    '.ts',
    '.tsx',
    '.js',
    '.jsx',
    '.json'
  ])
  config.module.rules[0].include = srcPaths
  config.module.rules[0].exclude = [/[/\\\\]node_modules[/\\\\]/]
  config.module.rules[0].use[0].options.babelrc = false
  config.module.rules[0].use[0].options.configFile = false
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    use: [
      {
        loader: require.resolve('babel-loader')
      }
    ]
  })
  config.plugins.push(
    new ForkTsCheckerWebpackPlugin({
      typescript: resolve.sync('typescript', {
        basedir: paths.appNodeModules
      }),
      async: false,
      checkSyntacticErrors: true,
      tsconfig: paths.appTsConfig,
      reportFiles: [
        '**',
        '!**/*.json',
        '!**/__tests__/**',
        '!**/?(*.)(spec|test).*',
        '!src/setupProxy.js',
        '!src/setupTests.*'
      ],
      watch: paths.appSrc,
      formatter: typescriptFormatter
    })
  )
  return config
}
