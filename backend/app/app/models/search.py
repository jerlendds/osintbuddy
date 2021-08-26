from typing import TYPE_CHECKING

from sqlalchemy import Column, Integer, String, DateTime, func, ForeignKey
from sqlalchemy.orm import relationship

from app.db.base_class import Base

if TYPE_CHECKING:
    from .project import Project  # noqa: F401
    from .user_search import UserSearch  # noqa: F401


class Search(Base):
    id = Column(Integer, primary_key=True, index=True)
    query = Column(String, nullable=False)
    created = Column(DateTime(timezone=True), server_default=func.now())
    user_searches = relationship("UserSearch")
    search_category_id = Column(Integer, ForeignKey("searchcategory.id"))
    search_results = relationship("SearchResult")
