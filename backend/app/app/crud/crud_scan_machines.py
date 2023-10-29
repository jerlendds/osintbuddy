from app.crud.base import CRUDBase
from app.models.scans import Scan_Machines
from app.schemas.scan_machines import ScanMachineCreate, ScanMachineUpdate


class CRUDScanMachine(CRUDBase[Scan_Machines, ScanMachineCreate, ScanMachineUpdate]):
    pass


scan_machine = CRUDScanMachine(Scan_Machines)
