
import os
from casdoor import AsyncCasdoorSDK
from app.core.config import settings

print('settings.CASDOOR_CERT', settings.CASDOOR_CERT)
class Config:
    CASDOOR_SDK = AsyncCasdoorSDK(
        endpoint=settings.CASDOOR_ENDPOINT,
        client_id=settings.REACT_APP_CASDOOR_CLIENT_ID,
        client_secret=settings.CASDOOR_CLIENT_SECRET,
        certificate=settings.CASDOOR_CERT,
        org_name=settings.REACT_APP_CASDOOR_ORG_NAME,
        application_name=settings.REACT_APP_CASDOOR_APP_NAME,
    )
    REDIRECT_URI = 'http://localhost:3000/callback'
    SECRET_TYPE = 'filesystem'
    SECRET_KEY = os.urandom(24)
