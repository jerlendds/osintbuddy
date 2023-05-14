#!/bin/bash

# ANSI COLORS & COLORED LOGGING FUNCTIONS
## Reset
Color_Off=$(tput sgr0)       # Text Reset

## Regular Colors
Black=$(tput bold setaf 0)  # Black
Red=$(tput setaf 1)        # Red
Green=$(tput setaf 14)       # Green
Yellow=$(tput setaf 3)      # Yellow
Blue=$(tput setaf 4)        # Blue
Purple=$(tput setaf 5)     # Purple
Cyan=$(tput setaf 6)       # Cyan
White=$(tput setaf 7)      # White
## Bold
BBlack='\033[1;30m'       # Black
BRed='\033[1;31m'         # Red
BGreen='\033[1;32m'       # Green
BYellow='\033[1;33m'      # Yellow
BBlue='\033[1;34m'        # Blue
BPurple='\033[1;35m'      # Purple
BCyan='\033[1;36m'        # Cyan
BWhite='\033[1;37m'       # White

## Underline
UBlack='\033[4;30m'       # Black
URed='\033[4;31m'         # Red
UGreen='\033[4;32m'       # Green
UYellow='\033[4;33m'      # Yellow
UBlue='\033[4;34m'        # Blue
UPurple='\033[4;35m'      # Purple
UCyan='\033[4;36m'        # Cyan
UWhite='\033[4;37m'       # White

Clr_Eol=$(tput el)

## Background
On_Black=$(tput setab 0)      # Black
On_Red=$(tput setab 1)        # Red
On_Green=$(tput setab 14)       # Green
On_Yellow=$(tput setab 3)      # Yellow
On_Blue=$(tput setab 4)        # Blue
On_Purple=$(tput setab 5)     # Purple
On_Cyan=$(tput setab 6)       # Cyan
On_White=$(tput setab 7)      # White

## High Intensity
IBlack='\033[0;90m'       # Black
IRed='\033[0;91m'         # Red
IGreen='\033[0;92m'       # Green
IYellow='\033[0;93m'      # Yellow
IBlue='\033[0;94m'        # Blue
IPurple='\033[0;95m'      # Purple
ICyan='\033[0;96m'        # Cyan
IWhite='\033[0;97m'       # White

## Bold High Intensity
BIBlack='\033[1;90m'      # Black
BIRed='\033[1;91m'        # Red
BIGreen='\033[1;92m'      # Green
BIYellow='\033[1;93m'     # Yellow
BIBlue='\033[1;94m'       # Blue
BIPurple='\033[1;95m'     # Purple
BICyan='\033[1;96m'       # Cyan
BIWhite='\033[1;97m'      # White

## High Intensity backgrounds
On_IBlack='\033[0;100m'   # Black
On_IRed='\033[0;101m'     # Red
On_IGreen='\033[0;102m'   # Green
On_IYellow='\033[0;103m'  # Yellow
On_IBlue='\033[0;104m'    # Blue
On_IPurple='\033[0;105m'  # Purple
On_ICyan='\033[0;106m'    # Cyan
On_IWhite='\033[0;107m'   # White

On_Bold=$(tput bold)    # Select bold mode
On_Dim=$(tput dim)     # Select dim (half-bright) mode
On_Line=$(tput smul)    # Enable underline mode
On_NoLine=$(tput rmul)    # Disable underline mode
On_SBold=$(tput smso)    # Enter standout (bold) mode
On_NoSBold=$(tput rmso)    # Exit standout mode

## no args - returns underlined `OUTPUT:` text, underline stretches all cols:

log_line() {
    MSG=""
    COLS=`tput cols`
    LENGTH=0
    while [ $LENGTH -lt $COLS ]
    do
        MSG+=" "
        LENGTH=$[$LENGTH+1]
    done
  echo -e "$(tput setab 0)$(tput setaf 15)$(tput bold)$(tput smul)$MSG\e[00m"
}

log_output() {
    COLS=`tput cols`
    LENGTH=10
    while [ $LENGTH -lt $COLS ]
    do
        RESPONSE+=" "
        LENGTH=$[$LENGTH+1]
    done
    echo -e "$(tput setab 0)$(tput setaf 15)$(tput bold)$(tput smul)  OUTPUT: $RESPONSE\e[00m"
    echo ""
}

## [TASK] $1
log_task () {
  echo "$(tput setab 30)$(tput setaf 15)$(tput bold)""   [TASK]$(tput setaf 15)$(tput sgr0)$(tput setab 30) ${1:-Task description not set} $(tput setaf 15) ${Clr_Eol}${Color_Off}"
}

## [RUNNING] $1
log_run () {
  echo -e "$(tput bold)$(tput setaf 30)[RUNNING] $(tput sgr0)$1 ${Clr_Eol}${Color_Off}\n"
}


## [INFO] $1
log_info () {
  echo -e "${On_BIBlack}${BBlue}[INFO]${Color_Off}" ${On_BIBlack}${White}"$1"${Color_Off}
}

## [WARNING] $1
log_warning () {
  echo -e "${On_BIBlack}${BIYellow}[WARNING]${Color_Off}" ${On_BIBlack}${IWhite}"$1"${Color_Off}
}

## [ERROR] $1
log_error () {
  echo -e "${On_BIBlack}${BIRed}[ERROR]${Color_Off}" ${On_BIBlack}${White}"$1"${Color_Off}
}

## [USAGE] $1
log_usage () {
  echo -e "${On_BIBlack}${BIPurple}[USAGE]:${Color_Off} \n${On_BIBlack}${White}"$1"${Color_Off}"
}

log_custom () {
  echo -e "$1"
}


_c_helper(){
    for c; do
        printf '\e[48;5;%dm%03d' $c $c
    done
    printf '\e[0m \n'


}

_print_colors () {

  IFS=$' \t\n'
  _c_helper {0..15}
  for ((i=0;i<6;i++)); do
      _c_helper $(seq $((i*36+16)) $((i*36+51)))
  done
  _c_helper {232..255}
}