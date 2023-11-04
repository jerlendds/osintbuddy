import datetime
from uuid import UUID
from typing import Optional, List

from pydantic import BaseModel, validator
from app.api.utils import hid, sqids

GRAPH_NAMESPACE = 5172

# Shared properties
class GraphsBase(BaseModel):
    name: str
    description: Optional[str]

    is_favorite: bool = False


# Properties to receive via API on creation
class GraphCreate(GraphsBase):
    pass


# Properties to receive via API on update
class GraphUpdate(GraphsBase):
    pass


class GraphInDBBase(GraphsBase):
    id: str
    _extract_id = validator(
        'id',
        pre=True,
        allow_reuse=True
    )(lambda v: hid(v, GRAPH_NAMESPACE))

    class Config:
        from_orm = True


# Additional properties to return via API
class Graph(GraphInDBBase):
    updated: datetime.datetime
    created: datetime.datetime
    last_seen: datetime.datetime


# Additional properties stored in DB
class GraphInDB(GraphInDBBase):
    id: int
    uuid: UUID


class GraphsList(BaseModel):
    graphs: List[Graph]
    count: int


class AllGraphsList(BaseModel):
    graphs: List[Graph]
    count: int

    favorite_graphs: List[Graph]
    favorite_count: int