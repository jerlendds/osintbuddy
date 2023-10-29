from typing import Annotated

from casdoor import AsyncCasdoorSDK
from fastapi import APIRouter, Request, Depends, HTTPException

from app import crud, schemas, models
from app.core.logger import get_logger
from app.api import deps


log = get_logger("api_v1.endpoints.users")
router = APIRouter(prefix="/account")


@router.get(
    "/",
    response_model=schemas.CasdoorUser,
    response_model_exclude_none=True
)
async def get_account(
    request: Request,
    user: Annotated[schemas.CasdoorUser, Depends(deps.get_user_from_session)]
):
    sdk: AsyncCasdoorSdk = request.app.state.CASDOOR_SDK
    username = user.get("name")
    try:
        user_data = await sdk.get_user(username)
        return schemas.CasdoorUser(**user_data)
    except Exception as e:
        log.error("Error inside accounts.get_account:")
        log.error(e)
