import asyncio
from typing import Annotated
from fastapi import (
    APIRouter,
    HTTPException,
    Depends
)
from gremlinpy import Cluster
from gremlinpy.exception import GremlinServerError
from sqlalchemy.orm import Session

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
    user: Annotated[schemas.CasdoorUser, Depends(deps.get_user_from_session)],
    graph_id: str,
    db: Session = Depends(deps.get_db),
):
    graph = crud.graphs.get_by_uuid(
        db=db,
        uuid=graph_id
    )
    return graph


@router.put('/{graph_id}/favorite')
async def update_favorite_graph_uuid(
    user: Annotated[schemas.CasdoorUser, Depends(deps.get_user_from_session)],
    graph_id: str,
    is_favorite: bool = False,
    db: Session = Depends(deps.get_db),
):
    db_obj = crud.graphs.get_by_uuid(
        db=db,
        uuid=graph_id
    )
    updated_graph = crud.graphs.update_favorite_by_uuid(db, db_obj=db_obj, is_favorite=is_favorite)
    return updated_graph

@router.get(
    "",
    response_model=schemas.GraphsList
)
async def get_graphs(
    user: schemas.CasdoorUser = Depends(deps.get_user_from_session),
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    is_favorite: bool = False,
):
    if limit > 50:
        limit = 50
    db_graphs = crud.graphs.get_many_by_favorites(
        db=db,
        skip=skip,
        limit=limit,
        is_favorite=is_favorite
    )
    return {
        "graphs": db_graphs, 
        "count": crud.graphs.count_by_favorites(db, is_favorite)[0][0]
    }



@router.post(
    '',
    response_model=schemas.Graph
)
async def create_graph(
    user: Annotated[schemas.CasdoorUser, Depends(deps.get_user_from_session)],
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
    except (Exception, GremlinServerError) as error:
        log.error(error)
        raise HTTPException(status_code=422, detail='error')


@router.delete('')
async def delete_graph(
    user: Annotated[schemas.CasdoorUser, Depends(deps.get_user_from_session)],
    uuid: str,
    db: Session = Depends(deps.get_db),
):
    if uuid:
        crud.graphs.remove_by_uuid(db=db, uuid=uuid)
    else:
        raise HTTPException(status_code=422, detail='UUID is a required field')


@router.get('/{graph_id}/stats')
async def get_graph_stats(
    user: Annotated[schemas.CasdoorUser, Depends(deps.get_user_from_session)],
    graph_id: str,
    db: Session = Depends(deps.get_db)
):
    if not graph_id:
        raise HTTPException(status_code=422, detail='graph_id is a required field')
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
