from typing import Annotated
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, Response, Depends
from fastapi.routing import APIRoute
from fastapi.responses import UJSONResponse
from fastapi.openapi.utils import get_openapi
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from fastapi_cache import caches, close_caches
from fastapi_cache.backends.redis import CACHE_KEY, RedisCacheBackend
# import sentry_sdk
# from sentry_sdk.integrations.asyncio import AsyncioIntegration
from osintbuddy import discover_plugins
from app.api.api_v1.api import api_router
from app.core.config import settings, use_route_names_as_operation_ids
from app.core.casdoor import Config as CasdoorConfig
from app.api import deps
from app import schemas
# if settings.SENTRY_DSN:
#     sentry_sdk.init(
#         # integrations=(AsyncioIntegration(),),
#         dsn=settings.SENTRY_DSN,
#         traces_sample_rate=1.0,
#     )

async def on_shutdown() -> None:
    await close_caches()


async def on_startup() -> None:
    rc = RedisCacheBackend(settings.REDIS_URL)
    caches.set(CACHE_KEY, rc)


app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    default_response_class=UJSONResponse,
    on_startup=[on_startup],
    on_shutdown=[on_shutdown]
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/status")
def get_status():
    return {"status": "ok"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS"],
    allow_headers=[
        "Content-Type",
        "User-Agent",
        "If-Modified-Since",
        "Cache-Control",
        "Authorization",
        "Access-Control-Allow-Origin"
    ],
    expose_headers=[
        "x-osintbuddy-user",
        "x-osintbuddy-error"
    ],
)


app.add_middleware(
    SessionMiddleware,
    secret_key=CasdoorConfig.SECRET_KEY,
    max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES
)
app.state.CASDOOR_SDK = CasdoorConfig().CASDOOR_SDK
app.state.REDIRECT_URI = CasdoorConfig().REDIRECT_URI
app.state.SECRET_TYPE = CasdoorConfig().SECRET_TYPE
app.state.SECRET_KEY = CasdoorConfig().SECRET_KEY


use_route_names_as_operation_ids(app)

def app_openapi_schema(app):
    """Return openapi_schema. cached."""
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title=settings.PROJECT_NAME,
        version=settings.API_V1_STR,
        description=settings.PROJECT_DESCRIPTION,
        routes=app.routes,
    )
    openapi_schema["info"]["x-logo"] = {
        "url": "https://github.com/jerlendds/osintbuddy/assets/29207058/41d71b7f-2e51-4d43-8f4d-fa22635f98d3"
    }

    return openapi_schema

app.openapi_schema = app_openapi_schema(app)

