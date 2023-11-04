from typing import List
from app.crud.base import CRUDBase, ModelType
from app.models.graphs import Graphs
from app import schemas
from sqlalchemy.orm import Session
from sqlalchemy import func


class CRUDGraphs(CRUDBase[
    Graphs,
    schemas.GraphCreate,
    schemas.GraphUpdate
]):
    def get_multi_by_user(
        self, db: Session, *, skip: int = 0, limit: int = 100
    ) -> List[ModelType]:
        return db.query(self.model).offset(skip).limit(limit).all()

    def remove_by_uuid(self, db: Session, *, uuid: str) -> None:
        obj = db.query(self.model).where(self.model.uuid == uuid).first()
        if obj:
            db.delete(obj)
            db.commit()
            return obj

    def get_by_uuid(self, db: Session, *, uuid: str) -> None:
        obj = db.query(self.model).where(self.model.uuid == uuid).first()
        return obj

    def get_many_by_favorites(
        self, db: Session, *, skip: int = 0, limit: int = 100, is_favorite: bool = False
    ) -> List[ModelType]:
        return db.query(self.model).where(self.model.is_favorite == is_favorite).offset(skip).limit(limit).all()

    def count_by_favorites(self, db: Session, is_favorite: bool = False) -> int:
        return db.query(func.count(self.model.id)).where(self.model.is_favorite == is_favorite).all()

    def update_favorite_by_uuid(self, db: Session, db_obj: Graphs, is_favorite: bool = False):
        setattr(db_obj, 'is_favorite', is_favorite)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_user_graphs_by_favorites(
        self,
        db: Session,
        user: schemas.CasdoorUser,
        skip: int = 0,
        limit: int = 50,
        is_favorite: bool = True
    ):
        if limit > 50:
            limit = 50
        graphs = self.get_many_by_favorites(
            db=db,
            skip=skip,
            limit=limit,
            is_favorite=is_favorite
        )
        graphs_total_count: int = self.count_by_favorites(db, is_favorite)[0][0]
        return graphs, graphs_total_count


graphs = CRUDGraphs(Graphs)
