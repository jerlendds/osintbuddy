from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func
from app.db.base_class import Base
from sqlalchemy.orm import relationship
from sqlalchemy.orm import Mapped


# http://localhost:3000/app/settings - @todo
#   - make available on the settings UI
#   - implement proxy loading/test method for user on UI so we can also store
#     the proxies geolocation among whatever else for the proxy table on the UI
#   -
class Proxies(Base):
    id: Mapped[int] = Column(Integer, primary_key=True, index=True)
    host = Column(String, nullable=False)
    username = Column(Integer, nullable=True)
    password = Column(Integer, nullable=True)
    proxy_type_id: Mapped[int] = Column(Integer, ForeignKey("proxy_type.id"))
    proxy_type = relationship("Proxy_Type", back_populates="proxies")
    created = Column(DateTime, server_default=func.now())


# @todo seed initial proxy types to db on first app load:
#       ['tor', 'socks5', 'http', 'https', etc?]
class Proxy_Type(Base):
    id: Mapped[int] = Column(Integer, primary_key=True, index=True)
    name: Mapped[str] = Column(String, nullable=False)
    proxies: Mapped["Proxies"] = relationship("Proxies", back_populates="proxy_type")
