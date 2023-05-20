from fastapi import APIRouter

from app.api.api_v1.endpoints import (
    dorks,
    nodes,
    projects
)

api_router = APIRouter()


api_router.include_router(nodes.router, tags=["Nodes"])

api_router.include_router(dorks.router, tags=["Dorks"])
api_router.include_router(projects.router, tags=["Projects"])
