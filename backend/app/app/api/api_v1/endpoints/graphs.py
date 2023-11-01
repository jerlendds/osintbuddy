import asyncio
from typing import Annotated
from fastapi import APIRouter, HTTPException, Depends
from gremlinpy import Cluster
from gremlinpy.exception import GremlinServerError
from sqlalchemy.orm import Session
from starlette import status
from app.api import deps
from app import crud, schemas
from app.core.logger import get_logger
from app.db.janus import ProjectGraphConnection, janus_create_db


log = get_logger("api_v1.endpoints.graphs")
router = APIRouter(prefix="/graphs")


@router.get(
    '/{graph_id}',
    response_model=schemas.Graph
)
async def get_graph(
    user: Annotated[schemas.User, Depends(deps.get_user_from_session)],
    graph_id: str,
    db: Session = Depends(deps.get_db),
):
    try:
        graph = crud.graphs.get_by_uuid(
            db=db,
            uuid=graph_id
        )
        return graph
    except Exception as e:
        log.error('Error inside graphs.get_graph:')
        log.error(e)
        raise HTTPException(status_code=
            status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="There was an error fetching graphs. Please try reloading the page"
        )


@router.put('/{graph_id}/favorite')
async def update_favorite_graph_uuid(
    user: Annotated[schemas.User, Depends(deps.get_user_from_session)],
    graph_id: str,
    is_favorite: bool = False,
    db: Session = Depends(deps.get_db),
):
    try:
        db_obj = crud.graphs.get_by_uuid(
            db=db,
            uuid=graph_id
        )
        updated_graph = crud.graphs.update_favorite_by_uuid(db, db_obj=db_obj, is_favorite=is_favorite)
        return updated_graph
    except Exception as e:
        log.error('Error inside graphs.update_favorite_graph_uuid:')
        log.error(e)
        raise HTTPException(status_code=
            status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="There was an error bookmarking your graphs. Please try reloading the page"
        )


@router.get(
    "",
    response_model=schemas.GraphsList,
)
async def get_graphs(
    user: schemas.CasdoorUser = Depends(deps.get_user_from_session),
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    is_favorite: bool = False
) -> schemas.GraphsList:
    try:
        return crud.graphs.get_user_graphs_by_favorites(db, user, skip, limit, is_favorite=is_favorite)
    except Exception as e:
        log.error('Error inside graphs.get_graphs:')
        log.error(e)
        raise HTTPException(status_code=
            status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="There was an error fetching graphs. Please try reloading the page"
        )


@router.get(
    "/favorites",
    response_model=schemas.GraphsList
)
async def get_favorite_graphs(
    user: schemas.CasdoorUser = Depends(deps.get_user_from_session),
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
):
    try:
        return crud.graphs.get_user_graphs_by_favorites(db, user, skip, limit)
    except Exception as e:
        log.error('Error inside graphs.get_favorite_graphs:')
        log.error(e)
        raise HTTPException(status_code=
            status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="There was an error fetching graphs. Please try reloading the page"
        )


@router.post(
    '',
    response_model=schemas.Graph
)
async def create_graph(
    user: Annotated[schemas.User, Depends(deps.get_user_from_session)],
    obj_in: schemas.GraphCreate,
    db: Session = Depends(deps.get_db),
):
    try:
        obj_out = crud.graphs.create(db=db, obj_in=obj_in)
        cluster = await Cluster.open(
            asyncio.get_event_loop(),
            **{'hosts': ['janus'], 'port': 8182}
        )
        client = await cluster.connect(hostname='janus')
        await client.submit(janus_create_db(obj_out.uuid.hex))
        return obj_out
    except Exception as e:
        log.error('Error inside graphs.create_graph:')
        log.error(e)
        raise HTTPException(status_code=
            status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="There was an error creating your graph. Please try again"
        )


@router.delete('')
async def delete_graph(
    user: Annotated[schemas.User, Depends(deps.get_user_from_session)],
    uuid: str,
    db: Session = Depends(deps.get_db),
):
    try:
        crud.graphs.remove_by_uuid(db=db, uuid=uuid)
        return
    except Exception as e:
        log.error('Error inside graphs.delete_graph:')
        log.error(e)
        raise HTTPException(status_code=
            status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="There was an error deleting your graph. Please try again"
        )


@router.get('/{graph_id}/stats')
async def get_graph_stats(
    user: Annotated[schemas.User, Depends(deps.get_user_from_session)],
    graph_id: str,
    db: Session = Depends(deps.get_db)
):
    try:
        async with ProjectGraphConnection(graph_id) as g:
            unique_entities = await g.V().label().dedup().toList()
            total_entities = await g.V().count().toList()
            total_relations = await g.E().count().toList()
            
            unique_entity_counts = {"series": [], "labels": []}
            unique_out_edge_counts = {"series": [], "labels": []}
            
            for entity in unique_entities:
                entity_count = await g.V().hasLabel(entity).count().toList()
                unique_entity_counts["series"].append(entity_count[0])
                unique_entity_counts["labels"].append(entity)

                out_edge_count = await g.V().hasLabel(entity).outE().count().toList()
                unique_out_edge_counts['series'].append(out_edge_count[0])
                unique_out_edge_counts['labels'].append(entity)

            return {
                "entities": unique_entities,
                "total_entities": total_entities[0],
                "total_relations": total_relations[0],
                "unique_entity_counts": unique_entity_counts,
                "entity_oute_counts": unique_out_edge_counts
            }
    except Exception as e:
        log.error('Error inside graphs.get_graphs:')
        log.error(e)
        raise HTTPException(status_code=
            status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="There was an error fetching graphs. Please try reloading the page"
        )
