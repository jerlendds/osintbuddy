from typing import List

from sqlalchemy.orm import Session
from sqlalchemy import func, select

from app.crud.base import CRUDBase, ModelType
from app.models.entities import Entities
from app.schemas.entities import EntityCreate, EntityUpdate


class CRUDEntities(CRUDBase[
    Entities,
    EntityCreate,
    EntityUpdate
]):
    def get_multi_by_user(
        self, db: Session, *, skip: int = 0, limit: int = 100
    ) -> List[ModelType]:
        return db.query(self.model).offset(skip).limit(limit).all()

    def delete_by_uuid(
        self, db: Session, *, uuid
    ) -> None:
        obj = db.query(self.model).where(self.model.uuid == uuid).first()
        db.delete(obj)
        db.commit()
        return obj

    def get_by_uuid(
        self, db: Session, *, uuid: str = None
    ) -> List[ModelType]:
        return db.query(self.model).where(self.model.uuid == uuid).first()


    def update_favorite_by_uuid(self, db: Session, db_obj: Entities, is_favorite: bool = False):
        setattr(db_obj, 'is_favorite', is_favorite)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_many_by_favorites(
        self, db: Session, *, skip: int = 0, limit: int = 100, is_favorite: bool = False
    ) -> List[ModelType]:
        return db.query(self.model).where(self.model.is_favorite == is_favorite).offset(skip).limit(limit).all()

    def count_by_favorites(self, db: Session, is_favorite: bool = False) -> int:
        if isinstance(is_favorite, bool) and is_favorite:
            return db.query(func.count(self.model.id)).where(self.model.is_favorite == is_favorite).all()
        stmt = select(func.count(self.model.id)).where(
            (self.model.is_favorite == False) |
            (self.model.is_favorite == None)
        )
        return db.execute(stmt).all()

entities = CRUDEntities(Entities)
