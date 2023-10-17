import os
import secrets
from typing import Any, Dict, List, Optional, Union

from pydantic import (
    AnyHttpUrl,
    HttpUrl,
    PostgresDsn,
    validator
)

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: Optional[str] = "OSINTBuddy"
    PROJECT_DESCRIPTION: Optional[
        str
    ] = "Analyze, collect, and store OSINT data"
    ENVIRONMENT: str

    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = secrets.token_urlsafe(32)
    ADMIN_BACKEND_SECRET_KEY: str = secrets.token_urlsafe(32)
    # 60 minutes * 24 hours * 8 days = 8 days
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8
    BACKEND_CORS_ORIGINS: List[str] = os.getenv('BACKEND_CORS_ORIGINS')

    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    POSTGRES_PORT: str = "5432"
    POSTGRES_SERVER: str
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str
    SQLALCHEMY_DATABASE_URI: Optional[str] = None

    @validator("SQLALCHEMY_DATABASE_URI", pre=True)
    def assemble_db_connection(cls, v: Optional[str], values: Dict[str, Any]) -> Any:
        if isinstance(v, str):
            return v
        return f'postgresql://{values.get("POSTGRES_USER")}:{values.get("POSTGRES_PASSWORD")}@{values.get("POSTGRES_SERVER")}/{values.get("POSTGRES_DB")}'

    ENVIRONMENT: str = 'development'

    REDIS_URL: Optional[str] = "redis://queue:6379"
    REDIS_BROKER_URL: Optional[str] = "redis://queue:6379/1"
    REDIS_ENABLE_UTC: bool = True

    CELERY_BROKER_URL: str
    CELERY_BACKEND: str

    JANUSGRAPH_HOST: str = 'janus'
    JANUSGRAPH_PORT: int = 8182

    SENTRY_DSN: str = None
    
    class Config:
        case_sensitive = True


settings = Settings()
