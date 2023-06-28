from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func
from app.db.base_class import Base
from sqlalchemy.orm import relationship


class Proxies(Base):
    id = Column(Integer, primary_key=True, index=True)
    host = Column(String, nullable=False)
    username = Column(Integer, nullable=True)
    password = Column(Integer, nullable=True)
    proxy_type_id = Column(Integer, ForeignKey("proxy_type.id"))
    proxy_type = relationship("Proxy_Type", back_populates="proxies")
    created = Column(DateTime, server_default=func.now())


class Proxy_Type(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    proxies = relationship("Proxies", back_populates="proxy_type")
