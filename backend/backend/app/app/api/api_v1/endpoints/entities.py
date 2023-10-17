import datetime
from uuid import UUID
import json
import ujson
from fastapi import (
    APIRouter,
    HTTPException,
    Depends,
)
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from sqlalchemy import Row
from app.api import deps
from app import crud, schemas, models
from app.core.logger import get_logger
from app.api.utils import plugin_source_template
from app.db.encoder import SAEncoder


log = get_logger("api_v1.endpoints.entities")
router = APIRouter(prefix="/entities")


@router.get('/{entity_uuid}', operation_id="get_entity")
async def get_entity(
    entity_uuid: str,
    db: Session = Depends(deps.get_db),
):
    entities = crud.entities.get_by_uuid(db=db, uuid=UUID(entity_uuid))
    return entities


@router.post(
    '',
    operation_id="create_entity"
)
async def create_entity(
    entity: schemas.PostEntityCreate,
    db: Session = Depends(deps.get_db)
):
    return crud.entities.create(db, obj_in=schemas.EntityCreate(
        label=entity.label,
        author=entity.author,
        description=entity.description,
    ))


@router.put(
    '/{entity_id}',
    operation_id="update_entity_by_uuid"
)
async def update_entity(
    entity_id: str,
    obj_in: schemas.EntityBase,
    db: Session = Depends(deps.get_db)
):
    db_obj = crud.entities.get_by_uuid(db=db, uuid=entity_id)
    entity = crud.entities.update(db=db, db_obj=db_obj, obj_in=obj_in)
    return entity

      
@router.get(
    '',
    operation_id="get_entities",
)
async def get_many_entites_by_favorite(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    is_favorite: bool = False
):
    if limit > 50:
        limit = 50
    db_entities = crud.entities.get_many_by_favorites(
        db=db,
        skip=skip,
        limit=limit,
        is_favorite=is_favorite
    )
    return {
        "entities": [
            schemas.Entity.model_validate(next(iter(entity._mapping.values()))) 
            for entity in db_entities
        ],
        "count":  crud.entities.count_by_favorites(db, is_favorite)[0][0]
    }


@router.delete(
    '/{entity_id}',
    operation_id="delete_entity"
)
async def delete_entity(
    entity_id: str,
    db: Session = Depends(deps.get_db),
):
    if entity_id:
        return crud.entities.delete_by_uuid(db=db, uuid=entity_id)
    else:
        raise HTTPException(status_code=422, detail='entity_id is a required field')


@router.put('/{entity_id}/favorite', operation_id="update_favorite_entity_uuid")
async def update_entity_favorite(
    entity_id: str,
    is_favorite: bool = False,
    db: Session = Depends(deps.get_db),
):
    db_obj = crud.entities.get_by_uuid(
        db=db,
        uuid=entity_id
    )
    updated_entity = crud.entities.update_favorite_by_uuid(db, db_obj, is_favorite)
    return updated_entity