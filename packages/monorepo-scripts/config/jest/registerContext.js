'use strict'

const registerRequireContextHook = require('babel-plugin-require-context-hook/register')

registerRequireContextHook()
const requireContext = global.__requireContext
global.__requireContext = (basedir, directory, ...args) => {
  const webpackLoaders = /^.*!(.*)$/
  const contextDir = directory.replace(webpackLoaders, '$1')
  return requireContext(basedir, contextDir, ...args)
}
