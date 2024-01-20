import datetime
from uuid import UUID
from typing import Optional, List

from pydantic import BaseModel, validator, ConfigDict
from app.api.utils import get_hid
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
    label: Optional[str] = ""
    author: Optional[str] = ""
    description: Optional[str] = ""
    source: Optional[str] 


class EntityInDBBase(EntityBase):
    id: str
    _extract_id = validator(
        'id',
        pre=True,
        allow_reuse=True
    )(lambda v: get_hid(v, ENTITY_NAMESPACE))

    last_edited: datetime.datetime
    updated: datetime.datetime
    created: datetime.datetime


class Entity(EntityInDBBase):
    # model_config = ConfigDict(from_attributes=True)
    pass


class EntityInList(PostEntityCreate):
    id: str
    last_edited: datetime.datetime
    is_favorite: bool

class AllEntitiesList(BaseModel):
    entities: List[EntityInList]
    count: int
    favorite_entities: List[EntityInList]
    favorite_count: int


class EntitiesList(BaseModel):
    entities: List[Entity]
    count: int


class EntityInDB(EntityInDBBase):
    id: Optional[int] = None
    pass


class EntitiesListInDB(EntityInDB):
    entities: List[Entity]
    count: int

    model_config = ConfigDict(from_attributes=True)
