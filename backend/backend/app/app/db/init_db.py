from sqlalchemy.orm import Session
from app import crud, schemas
from app.core.config import settings
from app.core.logger import get_logger

# make sure all SQL Alchemy models are imported (app.db.base) before initializing DB
from .base import *  # noqa https://github.com/tiangolo/full-stack-fastapi-postgresql/issues/28

logger = get_logger(name=__name__)


def init_db(db: Session) -> None:
    return [
        {
            "status": "success",
            "service": "[Database: Create]",
            "message": "Configuring database from .env settings...",
        }
    ]
