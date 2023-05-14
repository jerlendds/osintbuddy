#!/bin/bash
# useful values and functions for scripts located in the `app/scripts/*` directory
# USAGE:
#!/bin/bash
# source $(dirname "$0")/init_env.sh

# If a script needs access to the development environment:
# VENV USAGE: 
# source $(dirname "$0")/venv.sh

# Common Variables
APP_ROOT="$(pwd -P)/"
SCRIPTS_PATH="$APP_ROOT"scripts
DOCS_INDEX=docs/build/html/index.html
DOCS_BUILD_PATH="$APP_ROOT"docs/build/html
source "$SCRIPTS_PATH/_colors.sh"
