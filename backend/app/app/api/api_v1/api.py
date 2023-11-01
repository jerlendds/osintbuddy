from fastapi import APIRouter

from .endpoints import graphs, nodes, entities, login, scans, account, config

api_router = APIRouter()

api_router.include_router(config.router, tags=["Config"])
api_router.include_router(login.router, tags=["Login"])
api_router.include_router(account.router, tags=["Accounts"])
api_router.include_router(graphs.router, tags=["Graphs"])
api_router.include_router(entities.router, tags=["Entities"])
api_router.include_router(nodes.router, tags=["Nodes"])
api_router.include_router(scans.router, tags=["Scans"])