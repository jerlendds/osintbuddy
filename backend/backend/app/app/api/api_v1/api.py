from fastapi import APIRouter

from app.api.api_v1.endpoints import (
    login,
    users,
    ghdb,
    cases,
    cses,
    extractors
)

api_router = APIRouter()
api_router.include_router(ghdb.router, tags=["ghdb"])
api_router.include_router(extractors.router, tags=["extract"])
api_router.include_router(cses.router, tags=["cses"])
api_router.include_router(cases.router, tags=["cases"])
api_router.include_router(login.router, tags=["login"])
api_router.include_router(users.router, tags=["users"])

