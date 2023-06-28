import datetime
from typing import Optional, List

from pydantic import BaseModel


# Cases
# Shared properties
class ProjectsBase(BaseModel):
    name: str
    description: str
    uuid: str

# Properties to receive via API on creation
class ProjectCreate(ProjectsBase):
    pass
    # is_superuser: bool = False


# Properties to receive via API on update
class ProjectUpdate(ProjectsBase):
    pass


class ProjectInDBBase(ProjectsBase):
    id: Optional[int] = None

    class Config:
        orm_mode = True


# Additional properties to return via API
class Project(ProjectInDBBase):
    updated: datetime.datetime
    created: datetime.datetime


# Additional properties stored in DB
class ProjectInDB(ProjectInDBBase):
    pass


class ProjectsListInDB(ProjectInDB):
    cases: List[ProjectInDB]

