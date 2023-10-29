#!/usr/bin/env sh
cp -r /home/osintbuddy-system/node_modules/ /app/

echo "$0 0"
echo "$1 1"
echo "$2 2"
echo "$3 3"
echo "$4 4"
echo "$REACT_APP_BASE_URL"
echo "$BASE_URL"
yarn ui:dev
