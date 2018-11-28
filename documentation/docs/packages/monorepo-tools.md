---
id: monorepo-tools
title: @monorepo/tools
---

This core package provides other packages with some scripts that encapsulate `eslint` and `prettier` logic.

## Getting Started
> I am expecting that once we get some templating tools built out, this package will be included in the base templates and this won't be a manual step for anyone. However, it will help to describe what's happening inside of `monorepo-tools` and how another package can use its scripts.

### 1. Add `@monorepo/tools` as a devDependency to your package.

Your package.json:
```JSON
{
  "devDependencies": {
    "@monorepo/tools": "0.0.1"
  }
}
```

### 2. Call the `monorepo-tools` scripts from your package's scripts.

Example:
```JSON
{
  "scripts": {
    "lint": "monorepo-tools lint ./src",
    "pre-commit": "monorepo-tools pre-commit"
  }
}
```

### 3. Create necessary configuration files in your package's root directory.

In order for the scripts to work, your package needs to define several config for the tools (e.g. `eslint`, `prettier`, `lint-staged`) that `monorepo-tools` uses under the hood. You can simply create the files and copy the example contents below to get started - and when you need it, you can just write JavaScript to extend the base config. All of the config files will either be automatically used by the specific tools or pointed to directly from one of the scripts defined in this package.

> This isn't ideal - ideally there would be a base config that would be used and extending it would be optional. But I'll push that off to a later feature for now.


**.eslintrc.js**
```JS
const baseConfig = require('@monorepo/tools/eslint-config/react')

module.exports = baseConfig
```

**prettier.config.js**

```JS
const baseConfig = require("@monorepo/tools/prettier-config/react")

module.exports = baseConfig
```

**lint-staged.config.js**

The `lint-staged` doesn't actually extend anything yet due to the nature of the file structure. Certain packages may need completely custom `src` paths so, right now, it just expects a full config object and there is no base defined in `@monorepo/tools`.

```JS
module.exports = {
  "./src/**/*.js": ['monorepo-tools lint-fail-on-warn ./src', 'git add']
}
```

## Scripts
This section describes all of the different available scripts and their expected arguments that can be run.

All of the scripts currently exist in `tools.sh` which is exposed via the `"bin"` config option in `@monorepo/tools/package.json`.

### lint

`monorepo-tools lint <src>`

**args**
- `src` - the src file or directory that is passed to eslint to be linted

> This script also passes the `--fix` flag to eslint to format the files based on the `prettier` config. The `prettier` plugin is used in the base `eslint` config so that prettier is used to format the files instead of `eslint`. Use the `lint-only` script if you do not want the files to be formatted.

### lint-only

`monorepo-tools lint-only <src>`

**args**
- `src` - the src file or directory that is passed to eslint to be linted

> This script does not format the files.


### lint-fail-on-warn

`monorepo-tools lint-fail-on-warn <src>`

**args**
- `src` - the src file or directory that is passed to eslint to be linted
  
> This script auto-formats the files (like the `lint` script does) and will fail if there are any eslint warnings.

### pre-commit

`monorepo-tools pre-commit`

**args**

*This script accepts no arguments.*

> This script simply calls the `lint-staged` script that will use your packages `lint-staged.config.js`. See the [lint-staged.config.js](#3-create-necessary-configuration-files-in-your-package-s-root-directory) section on how to configure `lint-staged`.

# TODO
- [] use a default config for tooling if one isn't provided by user
