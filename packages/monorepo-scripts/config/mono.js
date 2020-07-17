'use strict'
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const findPkg = require('find-pkg')
const globby = require('globby')
const yaml = require('js-yaml')

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd())

const env = process.env.NODE_ENV
const isEnvTest = env === 'test'

const monorepoConfigDefaults = {
  src: 'src',
  lib: 'lib',
  srcWorkspaces: []
}

const pkgConfigPkgs = []
const ymlConfigPkgs = []

const getMonorepoConfig = pkgPath => {
  const { name, monorepoConfig: pkgMonorepoConfig } = JSON.parse(
    fs.readFileSync(path.resolve(pkgPath, 'package.json'))
  )
  let monorepoConfig = pkgMonorepoConfig
  if (monorepoConfig) {
    // maintain list of pkgs using pkg config for debugging purposes
    pkgConfigPkgs.push(name)
  } else {
    // Try to fallback to `.monorepo.yml`
    try {
      const monorepoConfigFile = yaml.safeLoad(
        fs.readFileSync(path.resolve(pkgPath, '.monorepo.yml'), 'utf8')
      )
      monorepoConfig = Object.assign({}, monorepoConfig, monorepoConfigFile)
    } catch (e) {
      console.log(chalk.red(`Missing monorepo config for "${name}".\n`))
    }
    if (monorepoConfig) {
      // maintain list of pkgs using pkg config for debugging purposes
      ymlConfigPkgs.push(name)
    } else {
      throw new Error('Script execution failed; invalid monorepo config!')
    }
  }
  try {
    const { env: envConfigMap = {}, ...baseConfig } = monorepoConfig
    const envConfig = envConfigMap[env] || {}
    monorepoConfig = Object.assign({}, baseConfig, envConfig)
  } catch (e) {
    console.log('Unable to graft `env` config; ensure proper configuration.')
  }
  return Object.assign({ name }, monorepoConfigDefaults, monorepoConfig)
}

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
        pkgs.concat(
          globby.sync(
            path.join(pattern, 'package.json').replace(/\\/g, '/'),
            globOpts
          )
        ),
      []
    )
    .map(f => path.dirname(path.normalize(f)))
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
function getPkgsAliases(allPkgs, allSrcPkgs) {
  return allPkgs.reduce((aliases, pkgPath) => {
    const { alias, name, src, lib } = getMonorepoConfig(pkgPath)
    const isSrcPkg = allSrcPkgs.includes(pkgPath)
    const target = isSrcPkg ? src : lib
    const pkgAlias = path.join(name, target)

    if (alias) {
      console.log(
        'monorepojs: package',
        name,
        'is aliased as',
        alias,
        'and must be imported using the alias from all code'
      )
    }

    if (isEnvTest) {
      /**
       * This will be passed to Jest's `transformModuleName` config option.
       * It must be a regex as the key. Below we want to match the name and
       * capture everything after the name (in the capture group) then
       * we want to pass it the capture group to the end of the transformation.
       */
      aliases[
        `^${(alias || name).replace('/', '/')}($|/.*)`
      ] = `${pkgAlias.replace('/', '/')}$1`
    } else {
      aliases[alias || name] = pkgAlias
    }
    return aliases
  }, {})
}

const appConfig = getMonorepoConfig(appDirectory)
const monoPkgPath = findPkg.sync(path.resolve(appDirectory, '..'))
const monoRootPath = monoPkgPath && path.dirname(monoPkgPath)
const monoPkg = monoPkgPath && require(monoPkgPath)
const patterns = monoPkg && monoPkg.workspaces
const isYarnWs = Boolean(patterns)
const srcPatterns = appConfig.srcWorkspaces
const allPkgs = patterns && findPkgs(monoRootPath, patterns)
const allSrcPkgs =
  srcPatterns && findPkgs(path.dirname(monoPkgPath), srcPatterns)
const srcPaths = allSrcPkgs
  ? allSrcPkgs.filter(f => fs.realpathSync(f) !== appDirectory)
  : []

// Convert the packages paths into the path to each package's source files.
const allPkgsSrcAliases = getPkgsAliases(allPkgs, srcPaths)

const isIncluded = dir => allPkgs && allPkgs.indexOf(dir) !== -1
const isAppIncluded = isIncluded(appDirectory)

function logPkgNamesByConfigType(type, pkgs) {
  if (!pkgs.length) {
    return
  }
  console.log(
    `\nMonorepo config sourced from ${chalk.cyan(
      `\`${type}\``
    )} for the following packages:` +
      pkgs.reduce(
        (logStr, pkgName) =>
          logStr + `\n  - ${chalk.green(chalk.bold(pkgName))}`,
        ''
      ) +
      '\n'
  )
}

logPkgNamesByConfigType('package.json', pkgConfigPkgs)
logPkgNamesByConfigType('.monorepo.yml', ymlConfigPkgs)

module.exports = {
  isMonorepo: isAppIncluded,
  isYarnWs,
  aliases: allPkgsSrcAliases,
  rootPath: monoRootPath,
  srcPaths
}
