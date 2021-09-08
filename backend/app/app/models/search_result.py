from typing import TYPE_CHECKING

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from app.db.base_class import Base

if TYPE_CHECKING:
    from .search import Search  # noqa: F401


class Search_Result(Base):  # noqa
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    url = Column(String)
    modified = Column(DateTime)
    created = Column(DateTime)
    thumbnail_url = Column(String)
    thumbnail_width = Column(String)
    thumbnail_height = Column(String)
    breadcrumb_url = Column(String)
    file_format = Column(String)
    search_id = Column(Integer, ForeignKey("search.id"))
    search = relationship("Search")
