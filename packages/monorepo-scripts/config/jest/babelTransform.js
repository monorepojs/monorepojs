// @remove-on-eject-begin
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// @remove-on-eject-end
'use strict'

const babelJest = require('babel-jest')

module.exports = babelJest.createTransformer({
  presets: [
    [
      // ES features necessary for user's Node version
      '@babel/preset-env',
      {
        targets: {
          node: 'current'
        }
      }
    ],
    [
      '@babel/preset-react',
      {
        // Adds component stack to warning messages
        // Adds __self attribute to JSX which React will use for some warnings
        development: true,
        // Will use the native built-in instead of trying to polyfill
        // behavior for any plugins that require one.
        useBuiltIns: true
      }
    ]
  ],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '^@signal/utils(.*)$': '@signal/utils/src\\1'
        }
      }
    ],
    'babel-plugin-macros',
    'require-context-hook',
    '@babel/plugin-transform-destructuring',
    '@babel/plugin-proposal-class-properties',
    // The following two plugins use Object.assign directly, instead of Babel's
    // extends helper. Note that this assumes `Object.assign` is available.
    // { ...todo, completed: true }
    [
      '@babel/plugin-proposal-object-rest-spread',
      {
        useBuiltIns: true
      }
    ],
    // Polyfills the runtime needed for async/await, generators, and friends
    // https://babeljs.io/docs/en/babel-plugin-transform-runtime
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: false,
        helpers: true,
        regenerator: true,
        // Undocumented option that lets us encapsulate our runtime, ensuring
        // the correct version is used
        // https://github.com/babel/babel/blob/090c364a90fe73d36a30707fc612ce037bdbbb24/packages/babel-plugin-transform-runtime/src/index.js#L35-L42
        absoluteRuntime: true
      }
    ],
    // Adds syntax support for import()
    '@babel/plugin-syntax-dynamic-import',
    // Transform dynamic import to require
    'babel-plugin-dynamic-import-node'
  ],
  // @remove-on-eject-begin
  babelrc: false,
  configFile: false
  // @remove-on-eject-end
})
