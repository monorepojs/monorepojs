#!/bin/bash

# Expects the first arg to be the command to run
CMD=$1

# Expects the second arg to be the src directory to pass to the command
SRC=$2
shift

exe() { echo "$@" ; $@ ; }

# # cd pwd
echo "called "
case $CMD in
  lint)
    exe "eslint $SRC --fix -c ./.eslintrc.js"
    ;;

  lint-only)
    exe "eslint $SRC -c ./.eslintrc.js"
    ;;

  lint-fail-on-warn)
    exe "eslint $SRC --fix -c ./.eslintrc.js --max-warnings=0"
    ;;

  pre-commit)
    # This command expects the lint-staged config to be defined in a local (to the each package)
    # lint-staged.config.js file
    exe "lint-staged"
    ;;

esac
