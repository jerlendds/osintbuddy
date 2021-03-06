import datetime
from typing import Optional

from pydantic import BaseModel


class SearchBase(BaseModel):
    query: str


class SearchUserSearchCreate(SearchBase):
    user_id: int
    search_id: int


class SearchCreate(SearchBase):
    pass


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


class SearchMetaData(SearchUpdate):
    created: datetime.datetime
    query: str
    user_id: int
    search_id: int
    user_search_id: int
    completed: Optional[bool] = False
    last_updated: datetime.datetime
    result_count: Optional[int] = 0
