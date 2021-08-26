from typing import TYPE_CHECKING

from sqlalchemy import Boolean, Column, Integer, String, DateTime, func
from sqlalchemy.orm import relationship

from app.db.base_class import Base

if TYPE_CHECKING:
    from .item import Item  # noqa: F401
    from .project import Project  # noqa: F401


class User(Base):
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean(), default=True)
    company = Column(String, nullable=True)
    country = Column(String, nullable=False)
    is_superuser = Column(Boolean(), default=False)
    last_updated = Column(DateTime(timezone=True), server_default=func.now())
    created = Column(DateTime(timezone=True), server_default=func.now())
    items = relationship("Item", back_populates="owner")
    projects = relationship("Project", back_populates="user")
