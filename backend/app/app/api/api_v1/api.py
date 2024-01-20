from fastapi import APIRouter
from app.core.config import settings

from .endpoints import entity, graph, graph_inquiry, login, scan, account, config

api_router = APIRouter(prefix=settings.API_V1_STR)

api_router.include_router(graph_inquiry.router, tags=["Nodes"])
api_router.include_router(config.router, tags=["Config"])
api_router.include_router(login.router, tags=["Login"])
api_router.include_router(account.router, tags=["Accounts"])
api_router.include_router(graph.router, tags=["Graphs"])
api_router.include_router(entity.router, tags=["Entities"])
api_router.include_router(scan.router, tags=["Scans"])