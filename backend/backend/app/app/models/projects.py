import uuid
import datetime
from sqlalchemy import Column, Integer, String, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from app.db.base_class import Base


class Projects(Base):
    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    uuid = Column(UUID(as_uuid=True), default=uuid.uuid4, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)

    updated = Column(DateTime, nullable=True, default=lambda x: datetime.datetime.utcnow(), server_default=func.now())
    created = Column(DateTime, server_default=func.now())
