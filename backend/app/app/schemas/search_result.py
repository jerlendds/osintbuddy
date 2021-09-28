import datetime
from typing import Optional

from pydantic import BaseModel


class SearchResultBase(BaseModel):
    title: str
    description: str
    url: str
    modified: datetime.datetime
    search_id: int


class SearchResultCreate(SearchResultBase):
    pass


class SearchResultUpdate(SearchResultBase):
    pass


class SearchResultInDBBase(SearchResultBase):
    id: int
    title: str
    description: str
    url: str
    modified: datetime.datetime
    search_id: int

    class Config:
        orm_mode = True


class SearchResult(SearchResultInDBBase):
    pass


