import uuid
import datetime

from sqlalchemy import Column, String, DateTime, Boolean, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base_class import Base


class Graphs(Base):
    id: Mapped[int] = mapped_column(primary_key=True)
    uuid: Mapped[UUID] = Column(UUID(as_uuid=True), default=uuid.uuid4, index=True)
    # hid: Mapped[str] = Column(String, default=)
    label: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str] = mapped_column(String(512), nullable=True)

    is_favorite: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    last_seen: Mapped[DateTime] = mapped_column(
        DateTime, default=lambda: datetime.datetime.utcnow(), server_default=func.now()
    )
    updated: Mapped[DateTime] = mapped_column(
        DateTime, default=lambda: datetime.datetime.utcnow(), server_default=func.now()
    )
    created: Mapped[DateTime] = Column(DateTime, server_default=func.now())

    def __repr__(self) -> str:
        return (
            f"Graphs(id={self.id!r}, "
            f"uuid={self.uuid!r}, "
            f"name={self.label!r}, "
            f"description={self.description[64:]!r}, "
            f"is_favorite={self.is_favorite!r}, "
            f"updated={self.updated!r}, "
            f"last_seen={self.last_seen!r}, "
            f"created={self.created!r})"
        )
