from typing import Optional, List

from pydantic import BaseModel


class Token(BaseModel):
    token: str
    token_type: str


class TokenPayload(BaseModel):
    sub: Optional[int] = None


class TokenData(BaseModel):
    username: str | None = None
    scopes: List[str] = []


class Status(BaseModel):
    status: str


class CasdoorTokens(BaseModel):
    access_token: str
    id_token: str
    refresh_token: str
    token_type: str
    scope: str
    expires_in: int
    