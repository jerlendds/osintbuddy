from uuid import uuid4
from sqlalchemy import Boolean, Column, Integer, String, DateTime, func, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base_class import Base


class User(Base):
    id: Mapped[int] = mapped_column(primary_key=True)
    uuid: Mapped[UUID] = mapped_column(UUID(as_uuid=True), default=uuid4)
    # cid == aka the casdoor user `id` 
    cid: Mapped[UUID] = mapped_column(UUID(as_uuid=True), index=True)
    name: Mapped[str] = mapped_column(String(64))
    username: Mapped[str] = mapped_column(String(80), index=True, default="")
    email: Mapped[str] = mapped_column(String, index=True, nullable=False, default="")
    email_verified: Mapped[bool] = mapped_column(Boolean, default=False)

    avatar: Mapped[str] = mapped_column(String, default="")
    # https://stackoverflow.com/a/63546063
    phone: Mapped[str] = mapped_column(String(64), default="")
    display_name: Mapped[str] = mapped_column(String(32), default="")
    first_name: Mapped[str] = mapped_column(String, default="")
    last_name: Mapped[str] = mapped_column(String, default="")
    phone: Mapped[str] = mapped_column(String, default="051N7")

    created_time: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_time: Mapped[DateTime] = mapped_column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())
    
    is_admin: Mapped[bool] = mapped_column(Boolean, default=False)
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False)
    is_forbidden: Mapped[bool] = mapped_column(Boolean, default=False)
    is_online: Mapped[bool] = mapped_column(Boolean, default=False)
