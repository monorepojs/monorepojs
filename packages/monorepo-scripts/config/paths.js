// @remove-on-eject-begin
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// @remove-on-eject-end
'use strict'

const path = require('path')
const fs = require('fs')
const url = require('url')

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = relativePath => path.resolve(appDirectory, relativePath)

const envPublicUrl = process.env.PUBLIC_URL

function ensureSlash(inputPath, needsSlash) {
  const hasSlash = inputPath.endsWith('/')
  if (hasSlash && !needsSlash) {
    return inputPath.substr(0, inputPath.length - 1)
  } else if (!hasSlash && needsSlash) {
    return `${inputPath}/`
  } else {
    return inputPath
  }
}

const getPublicUrl = appPackageJson =>
  envPublicUrl || require(appPackageJson).homepage

// We use `PUBLIC_URL` environment variable or "homepage" field to infer
// "public path" at which the app is served.
// Webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
function getServedPath(appPackageJson) {
  const publicUrl = getPublicUrl(appPackageJson)
  const servedUrl =
    envPublicUrl || (publicUrl ? url.parse(publicUrl).pathname : '/')
  return ensureSlash(servedUrl, true)
}

const moduleFileExtensions = [
  'web.mjs',
  'mjs',
  'web.js',
  'js',
  'web.ts',
  'ts',
  'web.tsx',
  'tsx',
  'json',
  'web.jsx',
  'jsx'
]

// Resolve file paths in the same order as webpack
const resolveModule = (resolveFn, filePath) => {
  const extension = moduleFileExtensions.find(extension =>
    fs.existsSync(resolveFn(`${filePath}.${extension}`))
  )

  if (extension) {
    return resolveFn(`${filePath}.${extension}`)
  }

  return resolveFn(`${filePath}.js`)
}

const defaultTargOpts = {
  appBuild: 'build',
  appHtml: 'index.html',
  appIndexJs: 'index',
  jsExts: []
}

const getPathOpts = appPackageJson => {
  const appPackage = require(appPackageJson)
  const target = process.env.TARGET
  let targOpts = defaultTargOpts

  if (target) {
    targOpts = appPackage.targets && appPackage.targets[target]
    if (!targOpts) {
      throw new Error(`Target ${target} not defined in package.json`)
    }
    targOpts = Object.assign({}, defaultTargOpts, targOpts)
    targOpts.appBuild = `${defaultTargOpts.appBuild}_${target}`
  }

  return {
    appBuild: targOpts.appBuild,
    appHtml: path.join('public', targOpts.appHtml),
    appIndexJs: path.join('src', targOpts.appIndexJs),
    jsExts: targOpts.jsExts
  }
}

//const appPackageJson = resolveApp('package.json');
let pathOpts = getPathOpts(resolveApp('package.json'))

// config after eject: we're in ./config/
module.exports = {
  dotenv: resolveApp('.env'),
  appPath: resolveApp('.'),
  appBuild: resolveApp(pathOpts.appBuild),
  appPublic: resolveApp('public'),
  appHtml: resolveApp(pathOpts.appHtml),
  appIndexJs: resolveModule(resolveApp, pathOpts.appIndexJs),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  appStorybookDir: resolveApp('.storybook'),
  jsExts: pathOpts.jsExts,
  appTsConfig: resolveApp('tsconfig.json'),
  yarnLockFile: resolveApp('yarn.lock'),
  testsSetup: resolveModule(resolveApp, 'src/setupTests'),
  proxySetup: resolveApp('src/setupProxy.js'),
  appNodeModules: resolveApp('node_modules'),
  publicUrl: getPublicUrl(resolveApp('package.json')),
  servedPath: getServedPath(resolveApp('package.json'))
}

module.exports.moduleFileExtensions = moduleFileExtensions

module.exports.srcPaths = [
  module.exports.appSrc,
  module.exports.appStorybookDir
]

// if app is in a monorepo (lerna or yarn workspace), treat other packages in
// the monorepo as if they are app source
const mono = require('./mono')
Array.prototype.push.apply(module.exports.srcPaths, mono.srcPaths)
module.exports.isMonorepo = mono.isMonorepo
module.exports.monorepoRoot = mono.rootPath
module.exports.monorepoPackageAliases = mono.aliases

module.exports.useYarn =
  fs.existsSync(path.join(module.exports.appPath, 'yarn.lock')) || mono.isYarnWs
