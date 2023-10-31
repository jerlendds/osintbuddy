import re, string, datetime
from uuid import UUID, uuid4
from typing import Optional, List, Union
from pydantic import BaseModel, validator, ConfigDict

from osintbuddy.utils import plugin_source_template


class EntityBase(BaseModel):

    label: Optional[str] = None
    author: Optional[str] = "Unknown author"
    description: Optional[str] = "No description found..."
    source: Optional[str] = None
    is_favorite: Optional[bool] = False

    @validator('source')
    def set_source(cls, v, values, **kwargs):
        if v is None:
            label, description, author = values.get('label'), values.get('description'), values.get('author')
            return plugin_source_template(label, description, author)
        return v


class EntityCreate(EntityBase):
    pass


class PostEntityCreate(BaseModel):
    label: str
    author: str
    description: str


class EntityUpdate(EntityBase):
    label: Optional[str]
    author: Optional[str]
    description: Optional[str]
    source: Optional[str]


class EntityInDBBase(EntityBase):
    uuid: Optional[UUID] = None

    last_edited: Optional[Union[datetime.datetime, None]]
    updated: Optional[Union[datetime.datetime, None]]
    created: Optional[Union[datetime.datetime, None]]

# Additional properties to return via API
class Entity(EntityInDBBase):
    model_config = ConfigDict(from_attributes=True)

    

# Additional properties stored in DB
class EntityInDB(EntityInDBBase):
    id: Optional[int] = None
    pass


class EntitiesListInDB(EntityInDB):
    entities: List[Entity]
    count: int

    model_config = ConfigDict(from_attributes=True)
