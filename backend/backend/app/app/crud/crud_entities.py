from typing import List

from sqlalchemy.orm import Session

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


entities = CRUDEntities(Entities)
