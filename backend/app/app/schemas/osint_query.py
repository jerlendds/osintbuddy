from typing import Optional, Union, Type, List, Dict

from pydantic import BaseModel



# {
# "search_depth": int,
# "token": str,
# "filters": [
    # {
        # "category": str,
        # "query": str
    # }
# ]
# }


# Shared properties
class OsintQueryBase(BaseModel):
    search_depth: Optional[int] = 1
    filters: Dict[str, Union[Type[int], Type[str], List[Dict[str, Type[str]]]]]
    title: Optional[str] = None
    description: Optional[str] = None


# Properties to receive on OsintQuery creation
class OsintQueryCreate(OsintQueryBase):
    title: str


# Properties to receive on OsintQuery update
class OsintQueryUpdate(OsintQueryBase):
    pass


# Properties shared by models stored in DB
class OsintQueryInDBBase(OsintQueryBase):
    id: int
    title: str
    owner_id: int

    class Config:
        orm_mode = True


# Properties to return to client
class OsintQuery(OsintQueryInDBBase):
    pass


# Properties properties stored in DB
class OsintQueryInDB(OsintQueryInDBBase):
    pass
