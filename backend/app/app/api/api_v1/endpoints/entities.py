from uuid import UUID
from typing import Annotated 

from fastapi import APIRouter, HTTPException, Depends,
from sqlalchemy.orm import Session
from starlette import status

from app.api import deps
from app import crud, schemas
from app.core.logger import get_logger


log = get_logger("api_v1.endpoints.entities")
router = APIRouter(prefix="/entities")


@router.get("/{entity_uuid}", response_model=schemas.Entity)
async def get_entity(
    user: Annotated[schemas.User, Depends(deps.get_user_from_session)],
    entity_uuid: str,
    db: Session = Depends(deps.get_db),
):
    try:
        entities = crud.entities.get_by_uuid(db=db, uuid=UUID(entity_uuid))
        return entities
    except Exception as e:
        log.error('Error inside entities.get_entity:')
        log.error(e)
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="There was an error getting your entity. Please try again"
        )


@router.get("")
async def get_entities(
    user: Annotated[schemas.User, Depends(deps.get_user_from_session)],
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    is_favorite: bool = False
):
    try:
        if limit > 50:
            limit = 50
        db_entities = crud.entities.get_many_by_favorites(
            db=db,
            skip=skip,
            limit=limit,
            is_favorite=is_favorite
        )
        return {
            "entities": db_entities,
            "count":  crud.entities.count_by_favorites(db, is_favorite)[0][0]
        }
    except Exception as e:
        log.error('Error inside entities.get_entity:')
        log.error(e)
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="There was an error getting your entities. Please try again"
        )


@router.post("")
async def create_entity(
    user: Annotated[schemas.User, Depends(deps.get_user_from_session)],
    entity: schemas.PostEntityCreate,
    db: Session = Depends(deps.get_db)
):
    try:
            return crud.entities.create(db, obj_in=schemas.EntityCreate(
            label=entity.label,
            author=entity.author,
            description=entity.description,
        ))
    except Exception as e:
        log.error('Error inside entities.create_entity:')
        log.error(e)
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="There was an error getting your entities. Please try again"
        )


@router.put("/{entity_id}")
async def update_entity_by_uuid(
    user: Annotated[schemas.User, Depends(deps.get_user_from_session)],
    entity_id: str,
    obj_in: schemas.EntityBase,
    db: Session = Depends(deps.get_db)
):
    try:
        db_obj = crud.entities.get_by_uuid(db=db, uuid=entity_id)
        entity = crud.entities.update(db=db, db_obj=db_obj, obj_in=obj_in)
        return entity
    except Exception as e:
        log.error('Error inside entities.update_entity_by_uuid:')
        log.error(e)
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="There was an error updating your entity. Please try again"
        )


@router.delete("/{entity_id}")
async def delete_entity(
    user: Annotated[schemas.User, Depends(deps.get_user_from_session)],
    entity_id: str,
    db: Session = Depends(deps.get_db),
):
    try:
        return crud.entities.delete_by_uuid(db=db, uuid=entity_id)
    except Exception as e:
        log.error('Error inside entities.delete_entity:')
        log.error(e)
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="There was an error getting your entities. Please try again"
        )


@router.put("/{entity_id}/favorite")
async def update_favorite_entity_uuid(
    user: Annotated[schemas.User, Depends(deps.get_user_from_session)],
    entity_id: str,
    is_favorite: bool = False,
    db: Session = Depends(deps.get_db),
):
    try:
        db_obj = crud.entities.get_by_uuid(
            db=db,
            uuid=entity_id
        )
        updated_entity = crud.entities.update_favorite_by_uuid(db, db_obj, is_favorite)
        return updated_entity
    except Exception as e:
        log.error('Error inside entities.update_favorite_entity_uuid:')
        log.error(e)
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="There was an error updating your favorite entities. Please try again"
        )
