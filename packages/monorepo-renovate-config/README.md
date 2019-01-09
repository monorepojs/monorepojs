# @monorepojs Renovate Preset

This directory contains the renovate config preset for the `@monorepojs` monorepo.

It can be used by appending `@monorepojs` to the `extends` option in your `renovate` config. For example:

```json
{
  "extends": ["config:base", "@monorepojs"]
}
```

This preset ensures that dependencies from the `@monorepojs` monorepo will be upgraded at the same time (in same branch/PR).
