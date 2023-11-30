from uuid import UUID
from typing import Annotated
from app.schemas.entities import ENTITY_NAMESPACE

from osintbuddy import Registry
from osintbuddy.templates.default import plugin_source_template
from osintbuddy.utils.generic import to_snake_case 
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from starlette import status

from app.api import deps
from app import crud, schemas
from app.core.logger import get_logger

log = get_logger("api_v1.endpoints.entities")
router = APIRouter(prefix="/entity")


async def fetch_node_transforms(plugin_label):
    plugin = await Registry.get_plugin(plugin_label=to_snake_case(plugin_label))
    if plugin is not None:
        labels = plugin().transform_labels
        return labels


@router.get("/plugins/transform/")
async def get_entity_transforms(
    user: Annotated[schemas.User, Depends(deps.get_user_from_session)],
    label: str
):
    try:
        if transforms := await fetch_node_transforms(label):
            return {
                "type": label,
                "transforms": transforms,
            }
        raise HTTPException(
            status_code=422,
            detail="Invalid transform error. Please file an issue if this occurs."
        )
    except Exception as e:
        log.error("Error inside entity.get_entity_transforms")
        log.error(e)
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="There was an error refreshing, please try again."
        )


@router.get("/details/{hid}", response_model=schemas.Entity)
async def get_entity(
    user: Annotated[schemas.User, Depends(deps.get_user_from_session)],
    hid: Annotated[str, Depends(deps.get_entity_id)],
    db: Annotated[Session, Depends(deps.get_db)],
):
    try:
        entities = crud.entities.get(db=db, id=hid)
        return entities
    except Exception as e:
        log.error('Error inside entity.get_entity:')
        log.error(e)
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="There was an error getting your entity. Please try again"
        )


@router.get(
    "",
    response_model=schemas.AllEntitiesList
)
async def get_entities(
    user: Annotated[schemas.User, Depends(deps.get_user_from_session)],
    db: Annotated[Session, Depends(deps.get_db)],
    skip: int = 0,
    limit: int = 100,
):
# try:
    if limit > 50:
        limit = 50
    db_entities, entities_count = crud.entities.get_many_by_favorites(
        db=db,
        skip=skip,
        limit=limit,
        is_favorite=False
    )
    db_favorite_entities, favorite_count = crud.entities.get_many_by_favorites(
        db=db,
        skip=skip,
        limit=limit,
        is_favorite=True
    )
    
    entities = []
    for entity in db_entities:
        entity = entity._asdict()
        entity["id"] = deps.hid(db_id=entity.get("id"), ns=ENTITY_NAMESPACE)
        entities.append(entity)
        print(entity)
    favorite_entities = []
    for entity in db_favorite_entities:
        entity = entity._asdict()
        entity["id"] = deps.hid(db_id=entity.get("id"), ns=ENTITY_NAMESPACE)
        favorite_entities.append(entity)
        print(entity)

        
    return {
        "entities": entities,
        "count":  entities_count,
        "favorite_entities": favorite_entities,
        "favorite_count":  favorite_count
    }
    # except Exception as e:
    #     log.error('Error inside entity.get_entities:')
    #     log.error(e)
    #     raise HTTPException(
    #         status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
    #         detail="There was an error getting your entities. Please try again"
    #     )

@router.post("")
async def create_entity(
    user: Annotated[schemas.User, Depends(deps.get_user_from_session)],
    entity: schemas.PostEntityCreate,
    db: Annotated[Session, Depends(deps.get_db)],
):
    try:
        return crud.entities.create(db, obj_in=schemas.EntityCreate(
            label=entity.label,
            author=entity.author,
            description=entity.description,
            source=plugin_source_template(
                label=entity.label,
                description=entity.description,
                author=entity.author
            )
        ))
    except Exception as e:
        log.error('Error inside entity.create_entity:')
        log.error(e)
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="There was an error creating your entity. Please try again"
        )


@router.put("/{hid}")
async def update_entity_by_id(
    user: Annotated[schemas.User, Depends(deps.get_user_from_session)],
    hid: Annotated[str, Depends(deps.get_entity_id)],
    obj_in: schemas.EntityBase,
    db: Annotated[Session, Depends(deps.get_db)],
):
    try:
        db_obj = crud.entities.get(db=db, id=hid)
        entity = crud.entities.update(db=db, db_obj=db_obj, obj_in=obj_in)
        return entity
    except Exception as e:
        log.error('Error inside entity.update_entity_by_uuid:')
        log.error(e)
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="There was an error updating your entity. Please try again"
        )


@router.delete("/{hid}")
async def delete_entity(
    user: Annotated[schemas.User, Depends(deps.get_user_from_session)],
    hid: Annotated[str, Depends(deps.get_entity_id)],
    db: Annotated[Session, Depends(deps.get_db)],
):
    try:
        return crud.entities.remove(db=db, id=hid)
    except Exception as e:
        log.error('Error inside entity.delete_entity:')
        log.error(e)
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="There was an error getting your entities. Please try again"
        )


@router.put("/{hid}/favorite")
async def update_entity_favorite_id(
    user: Annotated[schemas.User, Depends(deps.get_user_from_session)],
    hid: Annotated[str, Depends(deps.get_entity_id)],
    db: Annotated[Session, Depends(deps.get_db)],
):
    try:
        obj_in = crud.entities.get(db=db, id=hid)
        updated_entity = crud.entities.update_favorite_by_id(
            db,
            obj_in,
            is_favorite=not obj_in.is_favorite
        )
        return updated_entity
    except Exception as e:
        log.error('Error inside entity.update_favorite_entity_uuid:')
        log.error(e)
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="There was an error updating your favorite entities. Please try again"
        )
