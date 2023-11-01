from typing import Annotated, Union

from fastapi import APIRouter, Depends, HTTPException
from starlette import status 

from app.api.utils import APIRequest
from app import models, schemas
from app.core.logger import get_logger
from app.api import deps

log = get_logger("api_v1.endpoints.users")
router = APIRouter(prefix="/account")


@router.get(
    "/",
    response_model=Union[schemas.User, schemas.HTTPError],
    response_model_exclude_none=True
)
async def get_account(
    request: APIRequest,
    user: Annotated[schemas.User, Depends(deps.get_user_from_session)],
) -> models.User:
    try:
        return user
    except Exception as e:
        log.error("Error inside accounts.get_account:")
        log.error(e)
        del request.session["member"]
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Error: get account"
        )
