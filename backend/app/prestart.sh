#! /usr/bin/env bash

#echo 'Hello World' \
#alembic init alembic
#alembic revision -m "initial_revision" \


# Let the DB start
python /app/app/backend_pre_start.py

# Run migrations
alembic upgrade head

# Create initial data in DB
python /app/app/initial_data.py
