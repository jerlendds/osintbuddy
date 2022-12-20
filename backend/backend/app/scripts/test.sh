#!/usr/bin/env bash

set -e
set -x

pytest ./app/tests "${@}"
