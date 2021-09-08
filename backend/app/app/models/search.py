from typing import TYPE_CHECKING

from sqlalchemy import Column, Integer, String, DateTime, func, ForeignKey
from sqlalchemy.orm import relationship

from app.db.base_class import Base
from .search_category import Search_Category
from .cse import Cse

if TYPE_CHECKING:
    from .project import Project  # noqa: F401
    from .user_search import UserSearch  # noqa: F401


class Search(Base):
    id = Column(Integer, primary_key=True, index=True)
    query = Column(String, nullable=False)
    last_queried = Column(DateTime, nullable=False)
    #
    # searches = relationship("User_Search")
    #
    # search_category_id = Column(Integer, ForeignKey("search_category.id"))
    search_categories = relationship("Cse", secondary=Search_Category, back_populates="cse")
    #
    search_results = relationship("Search_Result")
    #
