from pydantic import BaseModel


class Msg(BaseModel):
    status: str
