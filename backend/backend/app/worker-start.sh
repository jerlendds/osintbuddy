#! /usr/bin/env bash
set -e

python app/celeryworker_pre_start.py

celery -A app.worker worker -l info -Q main-queue -c 3 -E 
flower --broker="$CELERY_BROKER_URL"



