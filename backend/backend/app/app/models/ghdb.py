from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func
from app.db.base_class import Base
from sqlalchemy.orm import relationship


class Google_Dorks(Base):
    id = Column(Integer, primary_key=True, index=True)
    dork = Column(String, nullable=False)
    date = Column(DateTime, nullable=False)

    categories = relationship("Dork_Categories", back_populates="dork")
    category_id = Column(Integer, ForeignKey("dork_categories.id"))

    author_id = Column(Integer, ForeignKey("dork_authors.id"))
    author = relationship("Dork_Authors", back_populates="dork")

    created = Column(DateTime, server_default=func.now())


class Dork_Authors(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    dork = relationship("Google_Dorks")


class Dork_Categories(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    dork = relationship("Google_Dorks")
