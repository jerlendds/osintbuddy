from pydantic import BaseModel


class Search(BaseModel):
    query: str
