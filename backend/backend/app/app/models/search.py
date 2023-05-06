from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func
from app.db.base_class import Base
from sqlalchemy.orm import relationship


class Cases(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)

    updated = Column(DateTime, nullable=True)
    created = Column(DateTime, server_default=func.now())


class Google_Search(Base):
    id = Column(Integer, primary_key=True, index=True)
    search_query = Column(String, nullable=False)

    updated = Column(DateTime, nullable=True)
    created = Column(DateTime, server_default=func.now())
