'use strict'

module.exports = {
  extends: ['react-app', 'plugin:prettier/recommended'],
  plugins: ['prettier'],
  settings: {
    react: {
      version: 'detect'
    }
  }
}
