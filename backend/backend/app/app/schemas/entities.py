import re, string, datetime
from uuid import UUID, uuid4
from typing import Optional, List, Union
from pydantic import BaseModel, validator, ConfigDict

from app.api.utils import plugin_source_template

# Entities
# Shared properties
class EntityBase(BaseModel):

    label: Optional[str] = None
    author: Optional[str] = "Unknown author"
    description: Optional[str] = "No description found..."
    source: Optional[str] = None
    is_favorite: Optional[Union[bool]] = False

    @validator('source')
    def set_source(cls, v, values, **kwargs):
        if v is None:
            label, description, author = values.get('label'), values.get('description'), values.get('author')
            return plugin_source_template(label, description, author)
        return v
# Properties to receive via API on creation
class EntityCreate(EntityBase):
    pass
    # is_superuser: bool = False
# Properties to receive via API on creation
class PostEntityCreate(BaseModel):
    label: str
    author: str
    description: str

# Properties to receive via API on update
class EntityUpdate(EntityBase):
    label: Optional[str]
    author: Optional[str]
    description: Optional[str]
    source: Optional[str]


class EntityInDBBase(EntityBase):
    id: int
    uuid: Optional[UUID] = None

    # @validator('uuid', always=True)
    # def set_uuid(cls, v, values, **kwargs):
    #     if v is None:
    #         return uuid4()
    #     return v

# Additional properties to return via API
class Entity(EntityInDBBase):
    model_config = ConfigDict(from_attributes=True)

    last_edited: Optional[Union[datetime.datetime, None]]
    updated: Optional[Union[datetime.datetime, None]]
    created: Optional[Union[datetime.datetime, None]]


# Additional properties stored in DB
class EntityInDB(EntityInDBBase):
    id: Optional[int] = None
    pass


class EntitiesListInDB(EntityInDB):
    entities: List[Entity]
    count: int

    model_config = ConfigDict(from_attributes=True)


