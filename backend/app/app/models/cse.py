from typing import TYPE_CHECKING

from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.db.base_class import Base
from .search_category import Search_Category

if TYPE_CHECKING:
    from .search_category import Search_Category  # noqa: F401


class Cse(Base):
    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, index=True)
    # search_category = relationship("Search_Category", back_populates="cses")
    # search_category_id = Column(Integer, ForeignKey("search_category.id"))
    cse = relationship("Search", secondary=Search_Category, back_populates="search_categories")