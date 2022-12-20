import datetime
from typing import Optional, List
from pydantic import BaseModel


# Google Dorks
# Shared properties
class GoogleDorksBase(BaseModel):
    dork: str
    date: datetime.datetime
    category_id: int
    author_id: int


# Properties to receive via API on creation
class GoogleDorksCreate(GoogleDorksBase):
    pass


# Properties to receive via API on update
class GoogleDorksUpdate(GoogleDorksBase):
    pass


class GoogleDorksInDBBase(GoogleDorksBase):
    id: Optional[int] = None

    class Config:
        orm_mode = True


# Additional properties to return via API
class GoogleDorks(GoogleDorksInDBBase):
    pass


# Additional properties stored in DB
class GoogleDorksInDB(GoogleDorksInDBBase):
    created: datetime.datetime


# Dork Authors

# Shared properties
class DorkAuthorsBase(BaseModel):
    name: str


# Properties to receive via API on creation
class DorkAuthorsCreate(DorkAuthorsBase):
    pass


# Properties to receive via API on update
class DorkAuthorsUpdate(DorkAuthorsBase):
    pass


class DorkAuthorsInDBBase(DorkAuthorsBase):
    id: Optional[int] = None

    class Config:
        orm_mode = True


# Additional properties to return via API
class DorkAuthors(DorkAuthorsInDBBase):
    pass


# Additional properties stored in DB
class DorkAuthorsInDB(DorkAuthorsInDBBase):
    pass


# Dork Categories
# Shared properties
class DorkCategoriesBase(BaseModel):
    name: str
    description: str


# Properties to receive via API on creation
class DorkCategoriesCreate(DorkCategoriesBase):
    pass


# Properties to receive via API on update
class DorkCategoriesUpdate(DorkCategoriesBase):
    pass


class DorkCategoriesInDBBase(DorkCategoriesBase):
    id: Optional[int] = None

    class Config:
        orm_mode = True


# Additional properties to return via API
class DorkCategories(DorkCategoriesInDBBase):
    pass


# Additional properties stored in DB
class DorkCategoriesInDB(DorkCategoriesInDBBase):
    pass


# Response
class GoogleDorksResponse(BaseModel):
    dorks: List[GoogleDorksInDBBase]
    count: int

    class Config:
        orm_mode = True
