import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings


DB_POOL_SIZE = int(os.getenv("DB_POOL_SIZE", "100"))
WEB_CONCURRENCY = int(os.getenv("WEB_CONCURRENCY", "4"))
POOL_SIZE = max(DB_POOL_SIZE // WEB_CONCURRENCY, 5)

engine = create_engine(settings.SQLALCHEMY_DATABASE_URI, pool_size=POOL_SIZE, max_overflow=0, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

