---
id: contributing
title: Contributing
---


# Committing Changes


***TL;DR** use `yarn commit` and not `git commit`*

>**Pre-commit Hooks:**
to aid code-consistency, ESLint is used as a pre-commit hook and *any* warnings or errors will result in a failed commit attempt. `Husky` adds the pre-commit hook that can intervene if `git commit` is used instead of `yarn commit`. The `yarn commit` script runs two commands sequentially: `lint && git-cz`. The `--no-verify` flag prevents husky from linting again after the `git-cz`. See below for more on `git-cz/commitizen`.

[Commitizen](https://github.com/commitizen/cz-cli), a CLI, is employed to manage and keep commit messages consistent. It's advised to never use `git commit` directly and use `yarn commit` instead to commit code changes. Commitizen is configured to use the standard [Conventional Commit](https://www.conventionalcommits.org/en/v1.0.0-beta.2/#specification) spec.

When you run `yarn commit` you will be greeted with a nice interface that will guide you through the process of creating a commit message that provides helpful context.

**Steps of the commit message:**
1. Select the type of change you are commiting. You can use the arrow up and down keys to choose between the different options. (Required)
![commit-step-1](assets/commit-step-1.png) 
2. Describe the scope of the change. Try to keep this to a single word. We suggest using the package name as the namespace then suffixed with the scope. Example: `my-mobile-app/my-component` (Required)
3. Write a short, imperative tense description of the chagne. (Required)
4. Add a more in-depth description of the change. (Optional, defaults to empty)
5. Denote whether there are breaking changes. (Optional, defaults to No)
6. Denote whether the change affects any open issues. (Optional, defaults to No)
