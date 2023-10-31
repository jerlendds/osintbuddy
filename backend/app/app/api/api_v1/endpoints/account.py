from typing import Annotated, Union

from fastapi import APIRouter, Depends, HTTPException

from app.api.utils import APIRequest
from app import schemas
from app.core.logger import get_logger
from app.api import deps


log = get_logger("api_v1.endpoints.users")
router = APIRouter(prefix="/account")


@router.get(
    "/",
    response_model=Union[schemas.CasdoorUser, schemas.HTTPError],
    response_model_exclude_none=True
)
async def get_account(
    request: APIRequest,
    user: Annotated[schemas.CasdoorUser, Depends(deps.get_user_from_session)]
):
    try:
        sdk = request.app.state.CASDOOR_SDK
        username = user.get("name")
        user_data = sdk.get_user(username)
        return schemas.CasdoorUser(**user_data.get('data'))
    except Exception as e:
        log.error("Error inside accounts.get_account:")
        log.error(e)
        del request.session["member"]
        raise HTTPException(
            status_code=401,
            detail="Error: get account"
        )


