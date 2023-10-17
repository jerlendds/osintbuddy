import datetime
from typing import Any, Dict, Optional, Union

from sqlalchemy.orm import Session

from app.core.security import get_password_hash, verify_password
from app.crud.base import CRUDBase
from app.models.scans import Scan_Machines
from app.schemas.scan_machines import ScanMachineCreate, ScanMachineUpdate


class CRUDScanMachine(CRUDBase[Scan_Machines, ScanMachineCreate, ScanMachineUpdate]):
    pass


scan_machine = CRUDScanMachine(Scan_Machines)
