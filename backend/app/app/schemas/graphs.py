import datetime
from uuid import UUID
from typing import Optional, List

from pydantic import BaseModel


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
    uuid: UUID
    
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


class GraphsList(BaseModel):
    graphs: List[Graph]
    count: int

    