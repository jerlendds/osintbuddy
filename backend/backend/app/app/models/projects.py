import uuid
import datetime
from typing import List
from sqlalchemy import Column, String, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from app.db.base_class import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.entities import Entities, ProjectEntities


# http://localhost:3000/app/projects - projects are the first table on the ui
# Endpoints for a users projects and their graphs can be found here:
#       backend/backend/app/app/api/api_v1/endpoints/projects.py
class Projects(Base):
    id: Mapped[int] = mapped_column(primary_key=True)
    uuid: Mapped[UUID] = Column(UUID(as_uuid=True), default=uuid.uuid4, index=True)

    name: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str] = mapped_column(String(512), nullable=True)

    # A project can have many entities and each entity can be for many projects
    entities: Mapped[List[Entities]] = relationship(secondary=ProjectEntities)

    updated: Mapped[DateTime] = mapped_column(
        DateTime,
        default=lambda: datetime.datetime.utcnow(),
        server_default=func.now()
    )
    created: Mapped[DateTime] = Column(DateTime, server_default=func.now())

    def __repr__(self) -> str:
        return (
            f'Projects(id={self.id!r}, '
            f'uuid={self.uuid!r}, '
            f'name={self.name!r}, '
            f'description={self.description[64:]!r}, '
            f'updated={self.updated!r}, '
            f'created={self.created!r})'
        )
