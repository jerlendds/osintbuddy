from typing import Union
from app.api.utils import APIRequest

from fastapi import APIRouter, Request, HTTPException

from app import schemas
from app.core.logger import get_logger


log = get_logger("api_v1.endpoints.login")
router = APIRouter(prefix="/auth")


@router.post("/sign-in", response_model=Union[schemas.Status, schemas.HTTPError])
async def post_signin(code: str, request: APIRequest):
    try:
        sdk = request.app.state.CASDOOR_SDK
        casdoor_tokens = sdk.get_oauth_token(code)
        log.info(casdoor_tokens)
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
