from starlette.requests import Request
from fastapi import HTTPException
from sqladmin.authentication import AuthenticationBackend

from app import schemas
from app.api.deps import get_db
from app.api.api_v1.endpoints.login import get_login_token


class AdminBackend(AuthenticationBackend):
    # https://github.com/aminalaee/sqladmin/blob/main/docs/authentication.md
    async def login(self, request: Request) -> bool:
        try:
            form = await request.form()
            username, password = form["username"], form["password"]
            for db in get_db():
                token: schemas.Token or HTTPException = get_login_token(db, username, password)
                if isinstance(token, HTTPException):
                    request.session.clear()
                    return False
                access_token = token.get("access_token")
                if access_token:
                    request.session.update({"token": access_token})
                    return True
        except Exception as e:
            print('uh oh.. @todo add sentry logging', e)
            request.session.clear()
        return False

    async def logout(self, request: Request) -> bool:
        # Usually you'd want to just clear the session
        # @todo invalidate token
        request.session.clear()
        return True

    async def authenticate(self, request: Request) -> bool:
        token = request.session.get("token")
        if not token:
            return False
        return True