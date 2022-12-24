import datetime
from typing import Optional, List

from pydantic import BaseModel


# Cases
# Shared properties
class CasesBase(BaseModel):
    name: str
    description: str
    owner_id: int


# Properties to receive via API on creation
class CasesCreate(CasesBase):
    pass
    # is_superuser: bool = False


# Properties to receive via API on update
class CasesUpdate(CasesBase):
    pass


class CasesInDBBase(CasesBase):
    id: Optional[int] = None

    class Config:
        orm_mode = True


# Additional properties to return via API
class Cases(CasesInDBBase):
    updated: datetime.datetime
    created: datetime.datetime


# Additional properties stored in DB
class CasesInDB(CasesInDBBase):
    pass


class CasesListInDB(CasesInDB):
    cases: List[CasesInDB]


# User searches for Google
# Shared properties
class GoogleSearchBase(BaseModel):
    name: str
    description: str
    owner_id: int


# Properties to receive via API on creation
class GoogleSearchCreate(CasesBase):
    pass
    # is_superuser: bool = False


# Properties to receive via API on update
class GoogleSearchUpdate(CasesBase):
    pass


class GoogleSearchInDBBase(CasesBase):
    id: Optional[int] = None

    class Config:
        orm_mode = True


# Additional properties to return via API
class GoogleSearch(CasesInDBBase):
    updated: datetime.datetime
    created: datetime.datetime


# Additional properties stored in DB
class GoogleSearchInDB(CasesInDBBase):
    pass
