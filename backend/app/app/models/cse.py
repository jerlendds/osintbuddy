from typing import TYPE_CHECKING

from sqlalchemy import Column, Integer, String, ForeignKey

from app.db.base_class import Base

if TYPE_CHECKING:
    from .search_category import SearchCategory  # noqa: F401


class Cse(Base):
    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, index=True)
    search_category_id = Column(Integer, ForeignKey("searchcategory.id"))
