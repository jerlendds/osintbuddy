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
