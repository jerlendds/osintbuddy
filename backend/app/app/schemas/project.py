import datetime
from typing import Optional

from pydantic import BaseModel


# Shared properties
class ProjectBase(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    created: datetime.datetime
    owner_id: int


# Properties to receive on Project creation
class ProjectCreate(ProjectBase):
    title: str
    description: Optional[str] = ""


# Properties to receive on Project update
class ProjectUpdate(ProjectBase):
    title: Optional[str]
    description: Optional[str]


# Properties shared by models stored in DB
class ProjectInDBBase(ProjectBase):
    id: int
    owner_id: int

    class Config:
        orm_mode = True


# Properties to return to client
class Project(ProjectInDBBase):
    title: str
    description: str
    created: datetime.datetime


# Properties properties stored in DB
class ProjectInDB(ProjectInDBBase):
    created: datetime.datetime
    owner_id: int
