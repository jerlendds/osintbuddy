from fastapi import APIRouter

from app.api.api_v1.endpoints import items, login, users, utils, search

api_router = APIRouter()
api_router.include_router(login.router, tags=["login"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(utils.router, prefix="/utils", tags=["utils"])
api_router.include_router(search.router, prefix="/search", tags=["search"])
