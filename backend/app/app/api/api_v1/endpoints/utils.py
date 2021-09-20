from typing import Any

from fastapi import APIRouter, Depends
from pydantic.networks import EmailStr
from sqlalchemy.orm import Session

from app import models, schemas
from app.api import deps
from app.core.celery_app import celery_app
from app.utils import send_test_email
from app import crud
from app.worker import start_cse_crawl

router = APIRouter()


@router.post("/test-celery/", response_model=schemas.Msg, status_code=201)
def test_celery(
    msg: schemas.Msg,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Test Celery worker.
    """
    celery_app.send_task("app.worker.test_celery", args=[msg.msg])
    return {"msg": "Word received"}


@router.post("/test-email/", response_model=schemas.Msg, status_code=201)
def test_email(
    email_to: EmailStr,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Test emails.
    """
    send_test_email(email_to=email_to)
    return {"msg": "Test email sent"}


@router.post("/search/")
def create_search(
    *,
    db: Session = Depends(deps.get_db),
    search_in: schemas.search.SearchCreate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new search.
    """
    search = crud.search.create_with_owner(db=db, obj_in=search_in)
    search_result = start_cse_crawl.delay(search_in.query)
    print("search_result task var:", search_result.ready())

    return search
