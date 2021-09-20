from typing import List

from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.search import Search
from app.schemas.search import SearchCreate, SearchUpdate


class CRUDSearch(CRUDBase[Search, SearchCreate, SearchUpdate]):
    def create_with_owner(self, db: Session, *, obj_in: SearchCreate) -> Search:
        print("HELLO SEARCH!: ", obj_in)
        obj_in_data = jsonable_encoder(obj_in)
        db_obj = self.model(**obj_in_data)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj


search = CRUDSearch(Search)
