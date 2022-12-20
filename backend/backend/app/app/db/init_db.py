from sqlalchemy.orm import Session
from app import crud, schemas
from app.core.config import settings
from app.core.logger import get_logger

# make sure all SQL Alchemy models are imported (app.db.base) before initializing DB
from .base import *  # noqa https://github.com/tiangolo/full-stack-fastapi-postgresql/issues/28

logger = get_logger(logger_name=__name__)


def init_db(db: Session) -> None:
    initialized_superuser = False
    user = crud.user.get_by_email(db, email=settings.FIRST_SUPERUSER)
    if not user:
        initialized_superuser = True
        user_in = schemas.UserCreate(
            email=settings.FIRST_SUPERUSER,
            full_name=settings.FIRST_SUPERUSER_FULLNAME,
            password=settings.FIRST_SUPERUSER_PASSWORD,
            is_superuser=True,
            country="USA",
            company="Josh Hlaviti",
        )
        user = crud.user.create(db, obj_in=user_in)  # noqa: F841
    return [
        {
            "status": initialized_superuser,
            "service": "[Database: Create]",
            "message": "No users detected. Creating first superuser from .env settings...",
        }
    ]
