from typing import Optional

from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from sqlalchemy.event import listen

from app.crud.base import CRUDBase
from app.models.search_result import Search_Result
from app.schemas.search_result import SearchResultCreate, SearchResultUpdate, SearchResult


class CRUDSearchResult(CRUDBase[SearchResult, SearchResultCreate, SearchResultUpdate]):

    def get_by_limit_offset(self, db: Session, search_id: int, min: int = 0, max: int = 100) -> Optional[SearchResult]:  # noqa
        query = db.query(self.model).filter(self.model.search_id == id)
        listen(query, 'before_compile', self._apply_limit(db, min, max), retval=True)
        return query

    def _apply_limit(self, db: Session, min: int, max: int):  # noqa
        def wrapped(query: db.query):
            if max:
                query = query.limit(max)
                if min:
                    query = query.offset(min * max)
            return query
        return wrapped


search_result = CRUDSearchResult(Search_Result)
