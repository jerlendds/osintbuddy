from typing import TYPE_CHECKING

from sqlalchemy import Column, Integer, String, Table, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

from app.db.base_class import Base

if TYPE_CHECKING:
    from .search import Search  # noqa: F401


Search_Category = Table("search_category", Base.metadata,
                        Column("search_id", Integer, ForeignKey('search.id')),
                        Column("cse_id", Integer, ForeignKey('cse.id')))

# class Search_Category(Base):  # noqa
#     id = Column(Integer, primary_key=True, index=True)
#     name = Column(String, index=True)
#
#     search = relationship("Search", back_populates="search_categories")
#     cses = relationship("Cse", backref="search_category")
