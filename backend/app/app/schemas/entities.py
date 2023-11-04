import datetime
from uuid import UUID
from typing import Optional, List, Union

from pydantic import BaseModel, validator, ConfigDict
from app.api.utils import hid
from osintbuddy.templates import plugin_source_template

ENTITY_NAMESPACE = 1510


class EntityBase(BaseModel):
    label: str = None
    author: str = "Unknown author"
    description: str = "No description found..."
    source: str = None
    is_favorite: bool = False

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
    id: str
    _extract_id = validator(
        'id',
        pre=True,
        allow_reuse=True
    )(lambda v: hid(v, ENTITY_NAMESPACE))

    last_edited: datetime.datetime
    updated: datetime.datetime
    created: datetime.datetime


# Additional properties to return via API
class Entity(EntityInDBBase):
    model_config = ConfigDict(from_attributes=True)


class AllEntitiesList(BaseModel):
    entities: List[Entity]
    count: int
    favorite_entities: List[Entity]
    favorite_count: int

class EntitiesList(BaseModel):
    entities: List[Entity]
    count: int

# Additional properties stored in DB
class EntityInDB(EntityInDBBase):
    id: Optional[int] = None
    pass


class EntitiesListInDB(EntityInDB):
    entities: List[Entity]
    count: int

    model_config = ConfigDict(from_attributes=True)
