from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.responses import UJSONResponse
from fastapi.openapi.utils import get_openapi
from fastapi.middleware.cors import CORSMiddleware
from fastapi_cache import caches, close_caches
from fastapi_cache.backends.redis import CACHE_KEY, RedisCacheBackend
# import sentry_sdk
# from sentry_sdk.integrations.asyncio import AsyncioIntegration
from osintbuddy import discover_plugins
from app.api.api_v1.api import api_router
from app.core.config import settings

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


app.include_router(api_router, prefix=settings.API_V1_STR)
app.openapi_schema = app_openapi_schema(app)

# @app.get("/sentry-debug")
# async def trigger_error():
#     division_by_zero = 1 / 0
#     return division_by_zero
