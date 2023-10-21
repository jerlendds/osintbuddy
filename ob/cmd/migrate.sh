# !/bin/bash
docker compose exec backend alembic revision --autogenerate -m "$1"
docker compose exec backend alembic upgrade head
docker compose exec backend useradd $USER
docker compose exec backend sh -c "chown $USER:$USER  -R alembic/versions/*.py"
