from sqladmin import ModelView

from fastapi import Depends, HTTPException, status
from jose import jwt
from pydantic import ValidationError
from sqlalchemy.orm import Session

from app.core import security
from app.core.config import settings
from app.api.deps import get_db, reusable_oauth2
from app.core.config import settings
from app import crud, models, schemas


def admin_auth_handler(
    token: str = Depends(reusable_oauth2)
) -> models.User:
        try:
            token = token.replace("Bearer ", "")
            payload = jwt.decode(
                token, settings.SECRET_KEY, algorithms=[security.ALGORITHM]
            )
            token_data = schemas.TokenPayload(**payload)
        except (jwt.JWTError, ValidationError):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Could not validate credentials",
            )
        for db in get_db():
            user = crud.user.get(db, id=token_data.sub)
        if not user:
            False
        return user


# @todo integrate with my auth backend instead of using `not IS_PROD` in development
class AuthModelAdmin(ModelView):
    def is_accessible(self, request) -> bool:
        return True
        if not settings.IS_PROD:
            print(" if not settings.IS_PROD:")
            return True
        current_user = admin_auth_handler(
            token=request.headers.get("authorization", "UNAUTHORIZED")
        )
        if not crud.user.is_superuser(current_user):
            return False
        return True

    def is_visible(self, request) -> bool:
        return True
        if not settings.IS_PROD:
            print("is_visible() if not settings.IS_PROD:")

            return True
        current_user = admin_auth_handler(
            token=request.headers.get("Authorization", "UNAUTHORIZED")
        )
        if not crud.user.is_superuser(current_user):
            return False
        return True
