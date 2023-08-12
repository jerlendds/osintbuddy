from fastapi import APIRouter

from app.api.api_v1.endpoints import projects, node, entities, users, login

api_router = APIRouter()


api_router.include_router(node.router, tags=["Nodes"])
api_router.include_router(entities.router, tags=["Entities"])
api_router.include_router(projects.router, tags=["Projects"])
api_router.include_router(login.router, tags=["login"])
api_router.include_router(users.router, tags=["users"])
