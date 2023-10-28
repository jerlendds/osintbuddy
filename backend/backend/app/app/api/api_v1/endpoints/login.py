from datetime import timedelta
from typing import Any

from fastapi import APIRouter, Body, Request, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse
from app import crud, schemas
from app.api import deps
from app.core import security
from app.core.config import settings
from app.core.logger import get_logger
from app.core.security import get_password_hash
from app.utils import (
    generate_password_reset_token,
    send_reset_password_email,
    verify_password_reset_token,
)


log = get_logger("api_v1.endpoints.login")
router = APIRouter()


@router.get("/get-account", response_class=JSONResponse)
async def get_account(request: Request, user=Depends(deps.get_user_from_session)):
    sdk = request.app.state.CASDOOR_SDK
    user_data = await sdk.get_user(user["name"])
    return user_data


@router.post("/sign-in", response_class=JSONResponse)
async def post_signin(code: str, request: Request):
    state = request.query_params.get("state")
    sdk = request.app.state.CASDOOR_SDK
    token = await sdk.get_oauth_token(code)
    user = sdk.parse_jwt_token(token.get("access_token", None))
    request.session["obUser"] = user
    return {"success": True}


@router.post("/sign-out", response_class=JSONResponse)
async def post_signout(request: Request):
    del request.session["obUser"]
    return {"success": True}
