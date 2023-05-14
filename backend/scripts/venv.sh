#!/bin/bash
source scripts/init_env.sh

source () {
  export $(grep -v '^#' $1 | xargs)
}

log_venv_init () {  
  venv_prefix="scripts"
  venv_suffix=".sh"
  source scripts/init_env.sh
  log_info "[$0] Activated venv: ${Blue}source${Color_Off} ${UWhite}${APP_ROOT}../venv_app/bin/activate${Color_Off}"
}

if [ "$0" == "scripts/venv.sh" ]; then
  log_usage "source ${APP_ROOT:0:(${#APP_ROOT}-10-2)}/venv_adspying/bin/activate"
else
  echo "else $0"
  source "${APP_ROOT}../venv_adspying/bin/activate"
  log_venv_init
fi