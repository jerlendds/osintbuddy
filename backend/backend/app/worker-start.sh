#! /usr/bin/env bash
set -e

python app/celeryworker_pre_start.py

# celery -A app.worker worker 
# celery -A app.worker worker -l info -Q main-queue -c 3 -E
celery -A app.worker worker --broker redis://redis:6379// -l info -Q main-queue -c 3 -E --result-backend redis://redis:6379/0 flower
