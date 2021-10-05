from typing import TYPE_CHECKING

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func, Float, Boolean
from sqlalchemy.orm import relationship

from app.db.base_class import Base

if TYPE_CHECKING:
    from .search import Search  # noqa: F401


class Udemy_Result(Base):  # noqa
    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, nullable=False)
    title = Column(String, nullable=False)
    url = Column(String, nullable=False)
    is_paid = Column(Boolean, nullable=False)
    tracking_id = Column(String, nullable=False)
    headline = Column(String, nullable=False)
    num_subscribers = Column(Integer, nullable=False)
    rating = Column(Float, nullable=False)
    num_reviews = Column(Integer, nullable=False)
    num_published_lectures = Column(Integer, nullable=False)
    instructional_level = Column(String, nullable=False)
    objectives_summary = Column(String, nullable=False)
    learn_url = Column(String, nullable=False)
    created = Column(DateTime(timezone=True), server_default=func.now())
    query = Column(String, nullable=False)



