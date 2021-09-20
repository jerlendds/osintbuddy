import datetime

from pydantic import BaseModel


class SearchBase(BaseModel):
    query: str


class SearchCreate(SearchBase):
    pass


class SearchUpdate(SearchBase):
    last_updated: datetime.datetime


class SearchInDBBase(SearchBase):
    id: int
    query: str
    created: datetime.datetime
    last_updated: datetime.datetime

    class Config:
        orm_mode = True


class Search(SearchInDBBase):
    pass
