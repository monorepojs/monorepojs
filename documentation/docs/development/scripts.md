---
id: scripts
title: Scripts
---

This doc contains information related to the scripts that can be found in the root level `package.json` file as well as the individual packages `package.json` files. Each script will have a short definition of what it does and, if applicable, some notes documenting important information about them (most likely information related to why they are set up the way they are).



# Root Scripts

The scripts below can be found in `~/package.json` (~ === root).

**Available Scripts**
 - [`lint`](#lint)
 - [`pre-commit`](#pre-commit)
 - [`commit`](#commit)

## `lint`

### How to run it

`yarn lint`

---


### What does it do?
This script executes the command `lerna run lint`. All this does is tells lerna to run every sub-package's `lint` script. It doesn't actually do any of the linting itself, but delegates that functionality to the individual sub-packages. So, if a sub-package defines a `lint` script then this command will call it. If the sub-package does not, then no script is called (this is ok if the package doesn't require linting). 

### Notes
It is expected that each sub-package takes care of defining its own lint implementation and this root-level script is simply a convenience script to run all sub-package's linting scripts.

## `pre-commit`

---


### How to run it
`yarn pre-commit`
> Note: You shoudn't ever need to run this command yourself. It is run automatically anytime a `git commit` (or `yarn commit`) is initiated.

### What does it do?
This script is run (as its name denotes) before a `git commit` is finalized. It should never be run directly, but rather is called by the `commit` script and the `husky` pre-commit hook. 

The script itself (similar to most other root level scripts) delegates the pre-commit logic to the individual sub-packages and simply serves the purpose of calling all sub-packages individual `pre-commit` scripts. Again, if a sub-package does not define a `pre-commit` script, that's ok - nothing will happen. 


### Notes
This script is called from both the `husky` hook (see the `"husky"` config in `~/package.json` for details) and via the `yarn commit` script.

**Why is it called "pre-commit" and not "precommit"?**
Its name is important. I originally attempted to call it `precommit` (instead of `pre-commit`), but this resulted in the script being called twice. Once from `husky` and once from yarn. The "feature" of husky calling this script automatically will soon be deprecated and this might be able to be updatd. Yarn has a feature that calls a script's `pre` and `post` companion automatically. The dash prevents this from being used by both husky and yarn so that we can have tighter control.

So, this script is called explicitly by the husky hook and as the first part of the `yarn commit` command. The `yarn commit` command adds a husky flag at the end called `--no-verify` that prevents the husky hook from being called after `yarn commit` is completed. 

## `commit`

---


### How to run it
`yarn commit`

### What does it do?
This command initiates the `commitizen` CLI tool that helps currate consistent commit messages.

This command should be used instead of the vanilla `git commit` command. See [Contributing/Commiting Changes](contributing#committing-changes) for more info on this. 

### Notes
Since Commitizen does not initiate an actual git commit until after the CLI is done, husky won't run the `pre-commit` script until after the message has already been created (which can be a huge pain if it fails and you have to redo the commitizen process). So, it's necessary to manually call the `pre-commit` script before actually calling `git-cz` (Commitizen's command). However, since Commitizen also creates a vanilla `git commit` at the end, it will trigger husky's pre-commit hook and, undesirably, calling the `pre-commit` script again. This can be avoided by ending the `commit` script with the `--no-verify` flag.

There are three important parts to this command. 

1 `yarn pre-commit &&` 2 `git-cz` 3 `--no-verify`

1. `yarn pre-commit` calls the pre-commit script (see [pre-commit](#pre-commit) docs for more info).
2. `git-cz` intiates commitizen CLI tool to create the commit message.
3. `--no-verify` is a `husky` specific flag that tells `husky` not to execute the `pre-commit` hook again once commitizen creates the actual `git commit`. 
