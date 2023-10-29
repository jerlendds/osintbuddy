from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from app.api import deps
from app.core.logger import get_logger
from app import crud, schemas

log = get_logger("api_v1.endpoints.scans")
router = APIRouter(prefix="/scans")


@router.post("/machines")
async def create_scan_machine(
    data: schemas.ScanMachineCreate,
    db: Session = Depends(deps.get_db),
):
    new_obj = crud.scan_machine.create(db=db, obj_in=data)
    return new_obj


@router.get("/machines")
async def get_scan_machines(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(deps.get_db),
):
    if limit > 100:
        limit = 100
    return crud.scan_machine.get_multi(db=db, limit=limit, skip=skip)


@router.delete("")
async def delete_scan_project(
    id: int,
    db: Session = Depends(deps.get_db),
):
    if id:
        return crud.projects.remove(db=db, id=id)
    else:
        raise HTTPException(status_code=422, detail="ID is a required field")
