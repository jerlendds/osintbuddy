from typing import Optional

from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from sqlalchemy.event import listen

from app.crud.base import CRUDBase
from app.models.search_result import Search_Result
from app.schemas.search_result import SearchResultCreate, SearchResultUpdate, SearchResult


class CRUDSearchResult(CRUDBase[SearchResult, SearchResultCreate, SearchResultUpdate]):
    def get_by_limit_offset(self, db: Session, search_id: int, limit: int = 0, offset: int = 100) -> Optional[SearchResult]:  # noqa
        query = db.query(self.model).with_entities(self.model.id, self.model.title, self.model.description, self.model.url).filter(self.model.search_id == search_id).limit(limit).offset(offset).all()
        return query

    def get_count(self, db: Session, search_id: int):
        query = db.query(self.model).filter(self.model.search_id == search_id).count()
        return query


search_result = CRUDSearchResult(Search_Result)
