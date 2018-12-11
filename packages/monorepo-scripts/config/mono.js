'use strict'
const fs = require('fs')
const path = require('path')
const findPkg = require('find-pkg')
const globby = require('globby')

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd())

const env = process.env.NODE_ENV
const isEnvDevelopment = env === 'development'
const isEnvProduction = env === 'production'
const isEnvTest = env === 'test'

const findPkgs = (rootPath, globPatterns) => {
  if (!globPatterns) {
    return []
  }
  const globOpts = {
    cwd: rootPath,
    strict: true,
    absolute: true
  }
  return globPatterns
    .reduce(
      (pkgs, pattern) =>
        pkgs.concat(globby.sync(path.join(pattern, 'package.json'), globOpts)),
      []
    )
    .map(f => path.dirname(path.normalize(f)))
}

const monorepoDefaults = {
  devFiles: 'src',
  prodFiles: 'lib'
}

/**
 * This function gets all of the potential package's production and dev file paths.
 * The returned object is passed as the alias config to the webpack config. This is
 * necessary because we want to allow the developer to write import names that
 * are consistent across prod and dev. In order to acheive that we must alias the
 * dev files folder and the production file folders.
 * This allows for imports to look like `import Thing from '@package/things/Thing'` and
 * the import will be aliased in each environment to allow for importing `src` files directly
 * in development and built source files in production.
 *
 * @return {Object} an object containing two mappings (one for dev one for prod) and each of
 * those objects looks like the object below.
 * {
 *    "@package/name": "path/to/files"
 * }
 */
function getPkgsAliases(allPkgs) {
  return allPkgs.reduce((aliases, pkgPath) => {
    const { name, monorepoConfig } = JSON.parse(
      fs.readFileSync(path.resolve(pkgPath, 'package.json'))
    )

    const opts = Object.assign({}, monorepoDefaults, monorepoConfig)

    if (isEnvDevelopment) {
      aliases[name] = path.join(name, opts.devFiles)
    } else if (isEnvProduction) {
      aliases[name] = path.join(name, opts.prodFiles)
    } else if (isEnvTest) {
      /**
       * This will be passed to Jest's `transformModuleName` config option.
       * It must be a regex as the key. Below we want to match the name and
       * capture everything after the name (in the capture group) then
       * we want to pass it the capture group to the end of the transformation.
       */
      aliases[`^${name.replace('/', '/')}(.*)`] = `${path
        .join(name, opts.devFiles)
        .replace('/', '/')}$1`
    }
    return aliases
  }, {})
}

const appPkg = JSON.parse(
  fs.readFileSync(path.resolve(appDirectory, 'package.json'))
)
const monoPkgPath = findPkg.sync(path.resolve(appDirectory, '..'))
const monoRootPath = monoPkgPath && path.dirname(monoPkgPath)
const monoPkg = monoPkgPath && require(monoPkgPath)
const patterns = monoPkg && monoPkg.workspaces
const isYarnWs = Boolean(patterns)
const srcPatterns = appPkg && appPkg.monorepoConfig.srcWorkspaces
const allPkgs = patterns && findPkgs(monoRootPath, patterns)

// Convert the packages paths into the path to each package's source files.
const allPkgsSrcAliases = getPkgsAliases(allPkgs)

const allSrcPkgs =
  srcPatterns && findPkgs(path.dirname(monoPkgPath), srcPatterns)
const isIncluded = dir => allPkgs && allPkgs.indexOf(dir) !== -1
const isAppIncluded = isIncluded(appDirectory)
const srcPaths = allSrcPkgs
  ? allSrcPkgs.filter(f => fs.realpathSync(f) !== appDirectory)
  : []

module.exports = {
  isMonorepo: isAppIncluded,
  isYarnWs,
  aliases: allPkgsSrcAliases,
  rootPath: monoRootPath,
  srcPaths
}
