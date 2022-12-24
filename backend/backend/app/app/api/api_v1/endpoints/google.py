from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import crud, schemas, models
from app.api import deps

router = APIRouter()


@router.get('')
def get_cases(
    current_user: models.User = Depends(deps.get_current_active_user),
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
        owner_id=current_user.id
    )
    obj_out = []
    for case in cases:
        obj_out.append(case.__dict__)

    return obj_out


@router.post('')
def create_case(
    name: str,
    current_user: models.User = Depends(deps.get_current_active_user),
    db: Session = Depends(deps.get_db),
    description: str = "",
):
    obj_in = schemas.CasesCreate(
        name=name,
        description=description,
        owner_id=current_user.id
    )
    return crud.cases.create(db=db, obj_in=obj_in)
