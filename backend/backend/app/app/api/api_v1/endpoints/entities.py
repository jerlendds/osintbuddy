from uuid import UUID
from fastapi import (
    APIRouter,
    HTTPException,
    Depends
)
from sqlalchemy.orm import Session
from app.api import deps
from app import crud, schemas
from app.core.logger import get_logger
from app.api.utils import plugin_source_template

logger = get_logger("api_v1.endpoints.entities")

router = APIRouter(prefix="/entities")


@router.post('')
async def create_entity(
    entity: schemas.EntityCreate,
    db: Session = Depends(deps.get_db)
):
    entity.source = plugin_source_template(entity)
    return crud.entities.create(db, obj_in=entity)


@router.get('/{entity_uuid}')
async def get_entity(
    entity_uuid: UUID,
    db: Session = Depends(deps.get_db),
):
    entities = crud.entities.get_by_uuid(db=db, uuid=entity_uuid)
    return entities


@router.put('/{entity_uuid}')
async def update_entity(
    entity_uuid: UUID,
    obj_in: schemas.EntityUpdate,
    db: Session = Depends(deps.get_db)
):
    db_obj = crud.entities.get_by_uuid(db=db, uuid=entity_uuid)
    entity = crud.entities.update(db=db, db_obj=db_obj, obj_in=obj_in)
    return entity


@router.get('')
async def get_entities(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
):
    if limit > 50:
        limit = 50

    db_entities = crud.entities.get_multi(
        db=db,
        skip=skip,
        limit=limit,
    )
    return {
        "entities": [{
            'uuid': row['uuid'],
            'label': row['label'],
            'description': row['description'],
            'author': row['author'],
            'created': row['created'],
        } for row in [row.__dict__ for row in db_entities]],
        "count": crud.entities.count_all(db)[0][0]
    }


@router.delete('')
async def delete_entity(
    uuid: str,
    db: Session = Depends(deps.get_db),
):
    if id:
        return crud.entities.delete_by_uuid(db=db, uuid=uuid)
    else:
        raise HTTPException(status_code=422, detail='ID is a required field')
