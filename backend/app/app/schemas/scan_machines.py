import datetime
from typing import Optional, List

from pydantic import BaseModel


# Cases
# Shared properties
class ScanMachineBase(BaseModel):
    name: str
    description: str


# Properties to receive via API on creation
class ScanMachineCreate(ScanMachineBase):
    pass
    # is_superuser: bool = False


# Properties to receive via API on update
class ScanMachineUpdate(ScanMachineBase):
    pass


class ScanMachineInDBBase(ScanMachineBase):
    id: Optional[int] = None
    uuid: str

    class Config:
        from_attributes = True


# Additional properties to return via API
class ScanMachine(ScanMachineInDBBase):
    updated: datetime.datetime
    created: datetime.datetime


# Additional properties stored in DB
class ScanMachineInDB(ScanMachineInDBBase):
    pass


class ScanMachinesListInDB(ScanMachineInDB):
    cases: List[ScanMachineInDB]
