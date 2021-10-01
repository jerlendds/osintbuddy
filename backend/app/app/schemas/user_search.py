from typing import List
from pydantic import BaseModel

from .search import Search


class UserSearchBase(BaseModel):
    user_id: int
    search_id: int


class UserSearchCreate(UserSearchBase):
    user_id: int
    search_id: int


class UserSearchUpdate(UserSearchBase):
    pass


class UserSearchInDBBase(UserSearchBase):
    id: int

    class Config:
        orm_mode = True


class UserSearch(UserSearchInDBBase):
    pass


class UserSearchHistory(BaseModel):
    searchHistory: List[Search]
