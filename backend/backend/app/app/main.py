import httpx
from starlette.requests import Request
from starlette.responses import StreamingResponse
from starlette.background import BackgroundTask
from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi
from fastapi.middleware.cors import CORSMiddleware
from fastapi_cache import caches, close_caches
from fastapi_cache.backends.redis import CACHE_KEY, RedisCacheBackend
from osintbuddy import discover_plugins

from app.api.api_v1.api import api_router
from app.core.config import settings


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
    # @todo upload a .png
    openapi_schema["info"]["x-logo"] = {
        "url": "https://raw.githubusercontent.com/jerlendds/osintbuddy/main/docs/assets/logo-watermark.svg"
    }
    return openapi_schema


@app.on_event('startup')
async def on_startup() -> None:
    if settings.ENVIRONMENT == 'development':
        discover_plugins('/plugins.osintbuddy.com/src/osintbuddy/core/')
        rc = RedisCacheBackend(settings.REDIS_URL)
        caches.set(CACHE_KEY, rc)


@app.on_event('shutdown')
async def on_shutdown() -> None:
    if settings.ENVIRONMENT == 'development':
        await close_caches()


app.include_router(api_router, prefix=settings.API_V1_STR)
app.openapi_schema = app_openapi_schema(app)

# client = httpx.AsyncClient(base_url="http://127.0.0.1/") # ?uri=


async def _reverse_proxy(request: Request):
    print(request.url, request.headers.raw, request.url.path[7:])
    # url = httpx.URL(
    #     # path='r',
    #                 # query=request.url.query.encode("utf-8"),
    # raw_path=f"/r?uri={request.url.path[7:].replace('https://', '').replace('http://', '')}".encode('ascii'))
    # print('httpx url: ', url)
    # rp_req = client.build_request(request.method, url,
    #                               headers=request.headers.raw,
    #                               content=await request.body())
    # print('rp_rq', rp_req)
    # rp_resp = await client.send(rp_req, stream=True)
    client =  httpx.Client(base_url="http://127.0.0.1/")
    url = f'/r?uri={request.url.path[7:]}'
    rp_req = client.build_request(
        request.method,
        url,
        headers=request.headers.raw,
        content=await request.body()
    )
    rp_resp = client.send(rp_req, stream=True)
    return StreamingResponse(
        rp_resp.aiter_raw(),
        status_code=rp_resp.status_code,
        headers=rp_resp.headers,
        background=BackgroundTask(rp_resp.aclose),
    )

app.add_route("/proxy/{path:path}", _reverse_proxy, ["GET", "POST"])
