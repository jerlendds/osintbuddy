from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, schemas
from app.api import deps

router = APIRouter(prefix="/cases")


@router.get("")
def get_cases(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
):
    if limit > 50:
        limit = 50

    cases = crud.cases.get_multi_by_user(
        db=db,
        skip=skip,
        limit=limit,
    )
    obj_out = []
    for case in cases:
        obj_out.append(case.__dict__)
    return {"projects": obj_out, "count": crud.cases.count_all(db)[0][0]}


@router.post("")
def create_case(
    name: str,
    db: Session = Depends(deps.get_db),
    description: str = "",
):
    obj_in = schemas.CasesCreate(
        name=name,
        description=description,
    )
    return crud.cases.create(db=db, obj_in=obj_in)


@router.delete("")
def delete_project(
    id: int,
    db: Session = Depends(deps.get_db),
):
    if id:
        return crud.cases.remove(db=db, id=id)
    else:
        raise HTTPException(status_code=422, detail="ID is a required field")
