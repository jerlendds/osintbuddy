from fastapi import APIRouter, FastAPI
from fastapi.responses import UJSONResponse
from fastapi.openapi.utils import get_openapi
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

# from fastapi_cache import caches, close_caches
# from fastapi_cache.backends.redis import CACHE_KEY, RedisCacheBackend
# import sentry_sdk
# from sentry_sdk.integrations.asyncio import AsyncioIntegration
from app.api.api_v1.api import api_router, node
from app.core.config import settings, use_route_names_as_operation_ids
from app.core.casdoor import Config as CasdoorConfig
# if settings.SENTRY_DSN:
#     sentry_sdk.init(
#         # integrations=(AsyncioIntegration(),),
#         dsn=settings.SENTRY_DSN,
#         traces_sample_rate=1.0,
#     )

# async def on_shutdown() -> None:
#     await close_caches()


# async def on_startup() -> None:
#     rc = RedisCacheBackend(settings.REDIS_URL)
#     caches.set(CACHE_KEY, rc)

app_routes = APIRouter()
app_routes.include_router(api_router)
app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    default_response_class=UJSONResponse,
    # on_startup=[on_startup],
    # on_shutdown=[on_shutdown]
)
app.include_router(app_routes)

use_route_names_as_operation_ids(app)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
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
casdoor_config = CasdoorConfig()
app.state.CASDOOR_SDK = casdoor_config.CASDOOR_SDK
app.state.REDIRECT_URI = casdoor_config.REDIRECT_URI
app.state.SECRET_TYPE = casdoor_config.SECRET_TYPE
app.state.SECRET_KEY = casdoor_config.SECRET_KEY


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
        "url": "https://raw.githubusercontent.com/jerlendds/osintbuddy/develop/ob/_assets/icon.png"
    }

    return openapi_schema

app.openapi_schema = app_openapi_schema(app)


@app.get("/status")
def get_status():
    return {"status": "ok"}
