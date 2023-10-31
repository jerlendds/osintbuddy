import uuid
import datetime
from typing import Optional
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func, Table, Boolean
from sqlalchemy.dialects.postgresql import UUID
from app.db.base_class import Base
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column


class Entities(Base):
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    uuid: Mapped[UUID] = mapped_column(UUID(as_uuid=True), default=uuid.uuid4)

    label: Mapped[str] = mapped_column(String(64), nullable=False)
    author: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(String(256), nullable=True)
    source: Mapped[str] = mapped_column(String, nullable=False)

    last_edited: Mapped[DateTime] = mapped_column(
        DateTime,
        default=lambda: datetime.datetime.utcnow(),
        server_default=func.now(),
    )
    is_favorite: Mapped[bool] = mapped_column(Boolean, default=False)

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
            f'last_edited={self.last_edited!r}, '
            f'updated={self.updated!r}, '
            f'created={self.created!r})'
        )
