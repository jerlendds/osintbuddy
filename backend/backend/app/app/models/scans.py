import datetime
from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey,
    func,
)
from sqlalchemy.dialects.postgresql import JSONB
from app.db.base_class import Base
from sqlalchemy.orm import relationship
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy_json import mutable_json_type


# http://localhost:3000/app/settings - @todo
#   - make available on the settings UI
#   - implement proxy loading/test method for user on UI so we can also store
#     the proxies geolocation among whatever else for the proxy table on the UI
#   -
class Scan_Machines(Base):
    id: Mapped[int] = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=False)

    machine = mapped_column(
        mutable_json_type(dbtype=JSONB, nested=True), default=lambda: {}
    )

    updated: Mapped[DateTime] = mapped_column(
        DateTime, default=lambda: datetime.datetime.utcnow(), server_default=func.now()
    )
    created = Column(DateTime, server_default=func.now())


class Scans(Base):
    id: Mapped[int] = Column(Integer, primary_key=True, index=True)

    updated: Mapped[DateTime] = mapped_column(
        DateTime, default=lambda: datetime.datetime.utcnow(), server_default=func.now()
    )
    created = Column(DateTime, server_default=func.now())
