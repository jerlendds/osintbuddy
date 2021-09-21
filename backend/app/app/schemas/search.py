import datetime
from typing import Optional

from pydantic import BaseModel


class SearchBase(BaseModel):
    query: str


class SearchCreate(SearchBase):
    completed: Optional[bool] = False


class SearchUpdate(SearchBase):
    completed: Optional[bool] = False
    result_count: int = 0
    last_updated: datetime.datetime


class SearchInDBBase(SearchBase):
    id: int
    query: str
    completed: bool
    result_count: int
    created: datetime.datetime
    last_updated: datetime.datetime

    class Config:
        orm_mode = True


class Search(SearchInDBBase):
    pass
