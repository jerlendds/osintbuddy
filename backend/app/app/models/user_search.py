from typing import TYPE_CHECKING

from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship

from app.db.base_class import Base

if TYPE_CHECKING:
    from .project import Project  # noqa: F401
    from .search import Search  # noqa: F401


class UserSearch(Base):
    id = Column(Integer, primary_key=True, index=True)
    searches = relationship("Search")
    project_id = Column(Integer, ForeignKey('project.id'))
    search_id = Column(Integer, ForeignKey('search.id'))
