from pydantic import BaseModel


class UserSearchBase(BaseModel):
    pass


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
