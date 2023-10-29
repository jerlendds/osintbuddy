from typing import Annotated, Union

from casdoor import AsyncCasdoorSDK
from fastapi import APIRouter, Body, Request, Depends, HTTPException

from app import crud, schemas
from app.api import deps
from app.core.logger import get_logger


log = get_logger("api_v1.endpoints.login")
router = APIRouter(prefix="/auth")


@router.post("/sign-in", response_model=schemas.Status)
async def post_signin(code: str, request: Request):
    try:
        sdk: AsyncCasdoorSDK = request.app.state.CASDOOR_SDK
        casdoor_tokens = await sdk.get_oauth_token(code)
        tokens = schemas.CasdoorTokens(**casdoor_tokens)

        user = sdk.parse_jwt_token(tokens.access_token)
        request.session["member"] = user
        return {"status": "ok"}
    except Exception as e:
        log.error("Error in login.post_signin:")
        log.error(e)
        return HTTPException(
            status_code=422,
            detail="A sign in error has occurred."
        )


@router.post("/sign-out", response_model=schemas.Status)
async def post_signout(request: Request):
    del request.session["member"]
    return {"status": "ok"}
