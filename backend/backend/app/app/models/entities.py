import uuid
import datetime
from typing import Optional
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func, Table
from sqlalchemy.dialects.postgresql import UUID
from app.db.base_class import Base
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column


# http://localhost:3000/app/projects - entities are at the second table on the ui
ProjectEntities = Table(
    "project_entities",
    Base.metadata,
    Column('project_id', ForeignKey('projects.id'), primary_key=True),
    Column('entity_id', ForeignKey('entities.id'), primary_key=True)
)

# Endpoints that use entities can be found here:
#       backend/backend/app/app/api/api_v1/endpoints/entities.py
class Entities(Base):
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    uuid: Mapped[UUID] = mapped_column(UUID(as_uuid=True), default=uuid.uuid4)

    label: Mapped[str] = mapped_column(String(64), nullable=False)
    author: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(String(256), nullable=True)
    source: Mapped[str] = mapped_column(String, nullable=False)

    updated: Mapped[DateTime] = mapped_column(
        DateTime,
        default=lambda: datetime.datetime.utcnow(),
        server_default=func.now()
    )
    created: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now())

    def __repr__(self) -> str:
        return (
            f'Entities(id={self.id!r}, '
            f'uuid={self.uuid!r}, '
            f'label={self.label!r}, '
            f'author={self.author!r}, '
            f'description={self.description[64:]!r}, '
            f'updated={self.updated!r}, '
            f'created={self.created!r})'
        )
