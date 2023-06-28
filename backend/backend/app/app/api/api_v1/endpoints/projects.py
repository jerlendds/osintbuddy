import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, schemas
from app.api import deps

router = APIRouter(prefix="/projects")


@router.get('')
def get_project(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
):
    if limit > 50:
        limit = 50

    db_projects = crud.projects.get_multi_by_user(
        db=db,
        skip=skip,
        limit=limit,
    )
    return {"projects": [row.__dict__ for row in db_projects], "count": crud.projects.count_all(db)[0][0]}


@router.post('')
def create_project(
    name: str,
    db: Session = Depends(deps.get_db),
    description: str = '',
):
    obj_in = schemas.ProjectCreate(
        name=name,
        description=description,
        uuid=uuid.uuid4().hex
    )
    return crud.projects.create(db=db, obj_in=obj_in)


@router.delete('')
def delete_project(
    id: int,
    db: Session = Depends(deps.get_db),
):
    if id:
        return crud.projects.remove(db=db, id=id)
    else:
        raise HTTPException(status_code=422, detail='ID is a required field')
