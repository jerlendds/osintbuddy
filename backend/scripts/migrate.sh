#!/bin/bash
docker compose exec backend alembic revision --autogenerate $1 "$2"
docker compose exec backend alembic upgrade head

# Fix alembic permissions issue
docker compose exec backend chmod -R 777 ../app/alembic/versions/
