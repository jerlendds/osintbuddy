from fastapi import APIRouter, HTTPException, Depends
from starlette import status
from sqlalchemy.orm import Session

from app.api import deps
from app.core.logger import get_logger
from app import crud, schemas

log = get_logger("api_v1.endpoints.scans")
router = APIRouter(prefix="/scan")


@router.post("/machines")
async def create_scan_machine(
    data: schemas.ScanMachineCreate,
    db: Session = Depends(deps.get_db),
):
    try:
        new_obj = crud.scan_machine.create(db=db, obj_in=data)
        return new_obj
    except Exception as e:
        log.error("Error inside scans.create_scan_machine:")
        log.error(e)
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="There was an error creating your scan, please try again."
        )


@router.get("/machines")
async def get_scan_machines(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(deps.get_db),
):
    try:
        if limit > 50:
            limit = 50
        return crud.scan_machine.get_many(db=db, limit=limit, skip=skip)
    except Exception as e:
        log.error("Error inside scans.get_scan_machines:")
        log.error(e)
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="There was an error getting your scans, please try again."
        )


@router.delete("")
async def delete_scan_project(
    sid: int,
    db: Session = Depends(deps.get_db),
):
    try:
        if sid:
            return crud.projects.remove(db=db, id=sid)
        else:
            raise HTTPException(status_code=422, detail="ID is a required field")
    except Exception as e:
        log.error("Error inside scans.delete_scan_project:")
        log.error(e)
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="There was an error deleting your scan, please try again."
        )
