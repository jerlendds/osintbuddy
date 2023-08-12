import datetime
from typing import Optional, List

from pydantic import BaseModel


# Entities
# Shared properties
class EntitiesBase(BaseModel):
    label: str
    author: str
    description: str
    source: str

# Properties to receive via API on creation
class EntityCreate(EntitiesBase):
    pass
    # is_superuser: bool = False


# Properties to receive via API on update
class EntityUpdate(EntitiesBase):
    label: Optional[str]
    author: Optional[str]
    description: Optional[str]
    source: Optional[str]


class EntityInDBBase(EntitiesBase):
    id: Optional[int] = None
    uuid: str

    class Config:
        orm_mode = True

# Additional properties to return via API
class Entity(EntityInDBBase):
    updated: datetime.datetime
    created: datetime.datetime


# Additional properties stored in DB
class EntityInDB(EntityInDBBase):
    pass


class EntitiesListInDB(EntityInDB):
    entities: List[EntityInDB]
