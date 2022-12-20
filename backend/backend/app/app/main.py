from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi
from fastapi.middleware.cors import CORSMiddleware
from sqladmin import Admin
from fastapi_cache import caches, close_caches
from fastapi_cache.backends.redis import CACHE_KEY, RedisCacheBackend


from app.db.session import engine
from app.api.api_v1.api import api_router
from app.core.config import settings
from app.admin import AdminBackend, UserAdmin


def redis_cache():
    return caches.get(CACHE_KEY)


app = FastAPI(
    title=settings.PROJECT_NAME, openapi_url=f"{settings.API_V1_STR}/openapi.json"
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
        "X-OSINTBuddy-UserError"
    ]
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
    # @todo ...
    # openapi_schema["info"]["x-logo"] = {
    # "url": "https://fastapi.tiangolo.com/img/logo-margin/logo-teal.png"
    # }
    return openapi_schema


@app.on_event('startup')
async def on_startup() -> None:
    if settings.PROD_ENV:
        rc = RedisCacheBackend(settings.REDIS_URL)
        caches.set(CACHE_KEY, rc)


@app.on_event('shutdown')
async def on_shutdown() -> None:
    await close_caches()
app.include_router(api_router, prefix=settings.API_V1_STR)
app.openapi_schema = app_openapi_schema(app)


ADMIN_MODELS = [UserAdmin]

admin = Admin(app, engine, authentication_backend=AdminBackend(
    secret_key=settings.ADMIN_BACKEND_SECRET_KEY
))
for model in ADMIN_MODELS:
    admin.register_model(model)
