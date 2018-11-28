---
id: monorepo-scripts
title: @monorepo/scripts
---

This core package provides other packages with predefined develop, test, and build scripts. It was originally created by ejecting from `@bradfordlemley/create-react-app` and adding some custom config options to it. 

`@bradfordlemley` was the original author of the monorepo support for `create-react-app` and these scripts are a result of ejecting from that repo.

## Getting Started
---

> I am expecting that once we get some templating tools built out, this package will be included in the base templates and this won't be a manual step for anyone. However, it will help to describe what's happening inside of `monorepo-scripts` and how another package can use its scripts.

### 1. Add `@monorepo/scripts` as a devDependency to your package.

Your package.json:
```JSON
{
  "devDependencies": {
    "@monorepo/scripts": "0.0.1"
  }
}
```

### 2. Add the `monorepo-scripts` scripts to your package's scripts.

Example:
```JSON
{
  "scripts": {
    "start": "monorepo-scripts start",
    "build": "monorepo-scripts build",
    "test": "monorepo-scripts test"
  }
}
```

### 3. Add configuration details to your packages `package.json`.
To get started, the least amount of configuration necessary is to define which folders (relative to the monorepo root) should be considered as `src` files. You can specify that by setting the `"monorepoConfig" | "srcWorkspaces"` in your `package.json`.

See [configuration](#configuration-packagejson) below for more information on the `monorepoConfig` options.

```JSON
{
  "monorepoConfig": {
    "srcWorkspaces": [
      "packages/*"
    ]
  }
}
```

Most likely the example above is all you will need. This tells the build scripts that you want to consider every sub-directory inside of `~/packages` as potential source files for your app. It's important to understand that every sub-driectory (1 level deep) under `~/packages` will be considered a local npm module and can be imported via `import Thing from '@my/cool-package'` where `@my/cool-package` lives in `~/packages/cool-package` with a `package.json` file that specifies the name `@my/cool-package`. Another important point to understand here is how `monorepo-scripts` creates aliases (see [devFiles](#devfiles-optional-defaults-to-src) & [prodFiles](#prodfiles-optional) config options) for the different scripts.

### 4. Create (if it doesn't already exist) an .eslintrc file
The scripts expect a local `.eslintrc.*` file to exist in the package that will be running the scripts. It is recommended that you use the `monorepo-tools` package for base configurations. See [monorepo-tools](packages/monorepo-tools.md#3-create-necessary-configuration-files-in-your-package-s-root-directory) docs for more information on this

> Consider that this file is a cross dependency of `monorepo-tools` and `monorepo-scrpts` they will both rely on the `.estlintrc.*` file's existence so that they both can draw from the same eslint options.

## Scripts
---

This section describes all of the different available scripts that can be run.

All script source files can be found in the `packages/monorepo-scripts/scripts/` directory.

### build

`monorepo-scripts build`

This script will create the necessary static build files for your app and put them inside a `your-app/build` folder. 

**How does the `build` script handle private monorepo modules?**

The `build` script expects all local monorepo packages that it depends on to have pre-built files that it will use when running the build process. See [prodFiles](#prodfiles-optional) for more information on how this works.

### start

`monorepo-scripts start`

This script stats webpack and hot-module reloading for all of your package's src files (including the `private` packages you may be using inside another directory in the monorepo).

**How does the `start` script handle private monorepo modules?**

The `start` script will import the `src` files of any local monorepo dependencies. See [devFiles](#devfiles-optional-defaults-to-src) for more information on how this works.

### test

`monorepo-scripts test`

Runs the tests for your apps (and not for any local monorepo dependencies). 

## Configuration `package.json`
---


All configuration defined in your `package.json` file and nested under the root level config object named `monorepoConfig`.

```JSON
{
  "monorepoConfig": {
    //... options go here
  }
}
```

### `sourceWorkspaces` (Optional - kind of...)
`sourceWorkspaces` expects an array of directory path globs that point to directories containing packages that should be considered as src when running the development scripts. 

These glob patterns will be used by the development script (`monorepo-scripts start`) to create an array of directories that will be passed to babel to transpile when webpack runs so that ES6 and JSX can be imported and transpiled properly. The globs should point to directories that contain a `package.json` file. In the example below it's expected that there will be `n` packages inside of the `packages/` directory that contain a `package.json`. And only directories that contain a `package.json` will be considered `src`.

The reason it's *kind of* optional is because it's expected (but not necessary) when working in this monorepo that you will want to develop a package that relies on another internal package and this is the only way to get hot-reloading and transpilation working with private packages in the monorepo.

> This has implications that should be understood in [devFiles](#devfiles-optional-defaults-to-src) & [prodFiles](#prodfiles-optional) config options. Please read through them before continuing.

**Example**
```JSON
{
  "monorepoConfig": {
    "srcWorkspaces": [
      "packages/*"
    ]
  }
}
```

### `devFiles` (Optional; Defaults to "src")
`devFiles` is an option for a package to tell `monorepo-scripts start` where its source files exist. It is expected to be a string pointing to a directory relative to the root of the current package. It defaults to `"src"`.

> Below I use the terms *another* and *this* when referring to two different packages. The *another* package refers to a package that is consuming the *this* package and this option (`devFiles`) is expected to be set in the `package.json` file for *this* package (the one being consumed by *another* package). So, most likely, when you're reading this this is only important if you're creating a package that will be consumed (during development) by another package. And you're probably currently working on *this* package.

This option will be used by the `monorepo-scripts start` command. When *another* package relies on *this* package and needs hot-reloading during development for changes to *this* package the `devFiles` (defined in *this* package's `package.json`) option tells webpack which directory (relative to the root of *this* package) the original source files exist so that they can be watched by webpack and transpiled by babel.

```JSON
{
  "monorepoConfig": {
    "devFiles": "path/to/src"
  }
}
```

#### Motivation
Ultimately what happens with this path is that when webpack is run, this path is used to create an alias for imports. For example, if your package, let's call it `package1`, is used by an app called `app1` then import statements in `app1` can look like `import Thing1 from 'Package1/Thing1'` and the alias mutates the import statement to be `import Thing1 from 'Package1/${devFiles}/Thing1'`. The reason this necessary is because we want to use different files for development and production scripts. See the [`prodFiles motivation section`](#motivation-1) for info on how aliases work with the `build` script.

### `prodFiles` (Optional; Defaults to "lib")
`prodFiles` is an option for a package to tell `monorepo-scripts build` & `monorepo-scripts test` where its built files exist. It is expected to be a string pointing to a directory relative to the root of the current package. It defaults to `"lib"`.

> Below I use the terms *another* and *this* when referring to two different packages. The *another* package refers to a package that is consuming the *this* package and this option (`prodFiles`) is expected to be set in the `package.json` file for *this* package (the one being consumed by *another* package). So, most likely, when you're reading this this is only important if you're creating a package that will be consumed (during development) by another package. And you're probably currently working on *this* package.

This option will be used by the `monorepo-scripts build` & `monorepo-scripts test` command. When *another* package relies on *this* package and uses modules from *this* package the `prodFiles` option tells webpack which directory (relative to the root of *this* package) the source files exist so that they can be consumed. The motivation section below can help you grasp a better understanding of why this is necessary.

```JSON
{
  "monorepoConfig": {
    "prodFiles": "path/to/lib"
  }
}
```

#### Motivation
Read through the [motivation](#motivation) section for `devFiles` first as it sets the preface for the information below.

In the `build` and `test` scripts `devFiles` is used to create an import alias for local monorepo dependencies. This allows imports inside of packages that use this package to not specify the directory that they're importing from so that the dev and build scripts can alias different directories resulting in different files being used for dev and build/test. For example, if your package, let's call it `package1`, is used by an app called `app1` then import statements in `app1` can look like `import Thing1 from 'Package1/Thing1'` and the alias mutates the import statement to be `import Thing1 from 'Package1/${prodFiles}/Thing1'`.

## TODO
---

### [ ] Remove the babel presets from the scripts
react-scripts, before ejecting, defines all of the config for `eslint` and `babel` inside of the scripts themselves. However, in order for local custom linting procedures for packages *and* the scripts to use the same eslint configuration, the current solution was to remove the base config for `eslint` from the scripts and force the existence of an `.eslintrc.js` file in any app that uses `monorepo-scripts`. So, the all scripts rely on `.estlintrc.*` (usually `.eslintrc.js`) to exist.

This is now inconsistent with the babel presets. Babel presets are currently defined similar to "pre-ejection" create-react-app. Meaning, the babel presets are defined inside of the webpack config files. At this moment, it's not necessary for them to exist inside of the app's directories too - since there are no other scripts relying on the babel config. However, with the current setup it `monorepo-scripts` is currently `react` specific because the babel presets are set to `react-app`.

For consistency's sake and maybe for future features it might be necessary to remove the babel presets from the scripts.
