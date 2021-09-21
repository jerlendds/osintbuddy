from typing import TYPE_CHECKING

from sqlalchemy import Column, Integer, String, DateTime, func, Boolean
from sqlalchemy.orm import relationship

from app.db.base_class import Base
from .search_category import Search_Category
from .search_result import Search_Result

if TYPE_CHECKING:
    from .project import Project  # noqa: F401
    from .user_search import UserSearch  # noqa: F401
    from .cse import Cse


class Search(Base):
    id = Column(Integer, primary_key=True, index=True)
    query = Column(String, nullable=False)
    created = Column(DateTime(timezone=True), server_default=func.now())
    last_updated = Column(DateTime(timezone=True), server_default=func.now())
    completed = Column(Boolean, default=0, nullable=False)
    result_count = Column(Integer(), default=0, nullable=False)
    #
    search_categories = relationship("Cse", secondary=Search_Category, back_populates="cse")
    #
    search_results = relationship("Search_Result", back_populates="search")
    #
