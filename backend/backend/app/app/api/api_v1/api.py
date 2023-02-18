from fastapi import APIRouter

from app.api.api_v1.endpoints import (
    login,
    users,
    ghdb,
    cases,
    cse,
    domain,
    ip,
    email,
    url,
    google,
    username
)

api_router = APIRouter()


api_router.include_router(google.router, tags=["Google"])
api_router.include_router(username.router, tags=["Username Transformations"])
api_router.include_router(url.router, tags=["URL Node Transformations"])
api_router.include_router(cse.router, tags=["CSE Node Transformations"])
api_router.include_router(domain.router, tags=["Domain Node Transformations"])
api_router.include_router(ip.router, tags=["IP Node Transformations"])
api_router.include_router(email.router, tags=["Email Node Transformation"])


api_router.include_router(ghdb.router, tags=["ghdb"])
api_router.include_router(cases.router, tags=["cases"])
api_router.include_router(login.router, tags=["login"])
api_router.include_router(users.router, tags=["users"])

