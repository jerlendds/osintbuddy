from typing import Optional

from pydantic import BaseModel


class Token(BaseModel):
    token: str
    token_type: str


class TokenPayload(BaseModel):
    sub: Optional[int] = None
