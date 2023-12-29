from typing import Annotated, Any

from fastapi import APIRouter, Depends

from app import schemas
from app.api.utils import APIRequest
from app.core.logger import get_logger
from app.api import deps


log = get_logger("api_v1.endpoints.casdoor")
router = APIRouter(prefix="/config")


@router.get("/casdoor", response_model=Any)
async def get_casdoor_config(
    request: APIRequest,
    user: Annotated[schemas.UserInDBBase, Depends(deps.get_user_from_session)]
):
    sdk = request.app.state.CASDOOR_SDK
    casdoor_apps = sdk.get_applications()
    casdoor_certs = sdk.get_certs()
    casdoor_orgs = sdk.get_organizations()
    casdoor_users = sdk.get_users()
    casdoor_models = sdk.get_models()
    casdoor_permissions = sdk.get_permissions()
    casdoor_providers = sdk.get_providers()
    casdoor_products = sdk.get_products()
    casdoor_payments = sdk.get_payments()
    casdoor_roles = sdk.get_roles()
    casdoor_webhooks = sdk.get_webhooks()
    casdoor_syncers = sdk.get_syncers()
    # casdoor_resources = sdk.get_resources()
    # casdoor_tokens = sdk.get_tokens()
    return {
        "applications": casdoor_apps.get('data', []),
        "organizations": casdoor_orgs.get('data', []),
        "users": casdoor_users.get('data', []),
        "certs": casdoor_certs.get('data', []),
        "models": casdoor_models.get('data', []),
        "permissions": casdoor_permissions.get('data', []),
        "providers": casdoor_providers.get('data', []),
        "products": casdoor_products.get('data', []),
        "payments": casdoor_payments.get('data', []),
        "roles": casdoor_roles.get('data', []),
        "syncers": casdoor_syncers.get('data', []),
        "webhooks": casdoor_webhooks.get('data', []),
        # "resources": casdoor_resources.get('data', []),
        # "tokens": casdoor_tokens.get('data', []),
    }
