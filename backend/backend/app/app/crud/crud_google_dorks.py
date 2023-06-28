from typing import List

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.crud.base import CRUDBase, ModelType
from app.models.ghdb import Google_Dorks
from app.schemas.ghdb import GoogleDorksCreate, GoogleDorksUpdate


class CRUDGoogleDorks(CRUDBase[
    Google_Dorks,
    GoogleDorksCreate,
    GoogleDorksUpdate
]):
    def get_multi_by_category(
        self,
        db: Session, *,
        skip: int = 0,
        limit: int = 100,
        category_id: int = 1,
    ) -> List[ModelType]:
        return db.query(self.model).filter_by(
            category_id=category_id
        ).offset(skip).limit(limit).all()

    def count_all_by_category(
        self,
        db: Session, *,
        category_id: int = 1,
    ) -> List[ModelType]:
        return db.query(func.count(self.model.id)).filter_by(
            category_id=category_id
        ).all()


dorks = CRUDGoogleDorks(Google_Dorks)
