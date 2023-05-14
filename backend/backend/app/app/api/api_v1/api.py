from fastapi import APIRouter

from app.api.api_v1.endpoints import (
    ghdb,
    cases,
    nodes
)

api_router = APIRouter()


api_router.include_router(nodes.router, tags=["Nodes"])

api_router.include_router(ghdb.router, tags=["ghdb"])
api_router.include_router(cases.router, tags=["cases"])
