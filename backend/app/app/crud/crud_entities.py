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

    def update_favorite_by_id(self, db: Session, db_obj: Entities, is_favorite: bool = False):
        setattr(db_obj, 'is_favorite', is_favorite)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_many_by_favorites(
        self, db: Session, *, skip: int = 0, limit: int = 100, is_favorite: bool = False
    ) -> List[ModelType]:
        entities = db.query(self.model).where(self.model.is_favorite == is_favorite).offset(skip).limit(limit).all()
        entities_count = self.count_by_favorites(db, is_favorite=is_favorite)[0][0]
        return entities, entities_count

    def count_by_favorites(self, db: Session, is_favorite: bool = False) -> int:
        return db.query(func.count(self.model.id)).where(self.model.is_favorite == is_favorite).all()

entities = CRUDEntities(Entities)
