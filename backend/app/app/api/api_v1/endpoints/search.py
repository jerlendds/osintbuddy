from typing import Any

from fastapi import APIRouter, Depends
from pydantic.networks import EmailStr

from app import models, schemas
from app.api import deps
from app.core.celery_app import celery_app
from app.utils import send_test_email

router = APIRouter()


@router.post("/test-query/", response_model=schemas.Search, status_code=201)
def test_query(
    query: schemas.Search,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Test Celery worker.
    """
    celery_app.send_task("app.worker.test_celery", args=[query])
    return {"msg": "Word received"}

