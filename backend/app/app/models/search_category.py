from typing import TYPE_CHECKING

from sqlalchemy import Boolean, Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from app.db.base_class import Base

if TYPE_CHECKING:
    from .project import Project  # noqa: F401
    from .search import Search  # noqa: F401


class SearchCategory(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    searches = relationship("Search")
    cses = relationship("Cse")
