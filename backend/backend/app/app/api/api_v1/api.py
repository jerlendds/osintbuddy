from fastapi import APIRouter, Header, Depends

from app.api.api_v1.endpoints import graphs, nodes, entities, users, login, scans

api_router = APIRouter()

api_router.include_router(nodes.router, tags=["Nodes"])
api_router.include_router(scans.router, tags=["Scans"])
api_router.include_router(entities.router, tags=["Entities"])
api_router.include_router(graphs.router, tags=["Graphs"])
api_router.include_router(login.router, tags=["login"])
api_router.include_router(users.router, tags=["users"])
