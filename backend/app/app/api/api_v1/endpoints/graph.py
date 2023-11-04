from uuid import UUID
from typing import Annotated, Union
from fastapi import APIRouter, HTTPException, Depends
from gremlinpy import Cluster
from sqlalchemy.orm import Session
from starlette import status
from app.api import deps
from app import crud, schemas
from app.core.logger import get_logger
from app.db.janus import ProjectGraphConnection, janus_create_db
from app.api.utils import hid

log = get_logger("api_v1.endpoints.graph")
router = APIRouter(prefix="/graph")


@router.get("/{hid}", response_model=schemas.Graph)
async def get_graph(
    user: Annotated[schemas.User, Depends(deps.get_user_from_session)],
    hid: Annotated[str, Depends(deps.get_graph_id)],
    db: Annotated[Session, Depends(deps.get_db)],
):
    try:
        graph = crud.graphs.get(
            db=db,
            id=hid
        )
        return graph
    except Exception as e:
        log.error('Error inside graph.get_graph:')
        log.error(e)
        raise HTTPException(status_code=
            status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="There was an error fetching graphs. Please try reloading the page"
        )


@router.patch('/{hid}/favorite/')
async def update_graph_favorite_id(
    user: Annotated[schemas.User, Depends(deps.get_user_from_session)],
    hid: Annotated[str, Depends(deps.get_graph_id)],
    db: Annotated[Session, Depends(deps.get_db)],
):
    try:
        db_obj = crud.graphs.get(
            db=db,
            id=hid
        )
        updated_graph = crud.graphs.update_favorite_by_uuid(
            db,
            db_obj=db_obj,
            is_favorite=not db_obj.is_favorite
        )
        return updated_graph
    except Exception as e:
        log.error('Error inside graph.update_graph_favorite_id:')
        log.error(e)
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="There was an error bookmarking your graphs. Please try reloading the page"
        )


@router.get(
    "",
    response_model=schemas.AllGraphsList,
)
async def get_graphs(
    user: Annotated[schemas.User, Depends(deps.get_user_from_session)],
    db: Annotated[Session, Depends(deps.get_db)],
    skip: int = 0,
    limit: int = 100,
    favorite_skip: int = 0,
    favorite_limit: int = 100
) -> schemas.GraphsList:
    try:    
        if favorite_limit > 50:
            favorite_limit = 50
        if limit > 50:
            limit = 50
        graphs, graphs_count = crud.graphs.get_many_user_graphs(
            db=db,
            user=user,
            skip=skip,
            limit=limit,
            is_favorite=False
        )
        favorite_graphs, favorite_count = crud.graphs.get_many_user_graphs(
            db=db,
            user=user,
            skip=favorite_skip,
            limit=favorite_limit,
            is_favorite=True
        )
        return {
            "graphs": graphs,
            "count": graphs_count,
            "favorite_graphs": favorite_graphs,
            "favorite_count": favorite_count
        }
    except Exception as e:
        log.error('Error inside graph.get_graphs:')
        log.error(e)
        raise HTTPException(status_code=
            status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="There was an error fetching graphs. Please try reloading the page"
        )


@router.get(
    "/favorites",
    response_model=schemas.GraphsList
)
async def get_graphs_by_favorite(
    user: Annotated[schemas.User, Depends(deps.get_user_from_session)],
    db: Annotated[Session, Depends(deps.get_db)],
    skip: int = 0,
    limit: int = 100,
    is_favorite: bool = None
):
    try:
        graphs, graphs_count = crud.graphs. \
            get_many_user_graphs(db, user, skip, limit, is_favorite=is_favorite)
        return {
            "graphs": graphs,
            "count": graphs_count
        }
    except Exception as e:
        log.error('Error inside graph.get_favorite_graphs:')
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
    db: Annotated[Session, Depends(deps.get_db)],
):
    try:
        obj_out = crud.graphs.create(db=db, obj_in=obj_in)
        cluster = await Cluster.open(**{'hosts': ['janus'], 'port': 8182})
        client = await cluster.connect(hostname='janus')
        await client.submit(janus_create_db(obj_out.uuid.hex))
        return obj_out
    except Exception as e:
        log.error('Error inside graph.create_graph:')
        log.error(e)
        raise HTTPException(status_code=
            status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="There was an error creating your graph. Please try again"
        )


@router.delete('')
async def delete_graph(
    user: Annotated[schemas.User, Depends(deps.get_user_from_session)],
    hid: Annotated[str, Depends(deps.get_graph_id)],
    db: Annotated[Session, Depends(deps.get_db)],
):
    try:
        crud.graphs.remove(db=db, id=hid)
        return
    except Exception as e:
        log.error('Error inside graph.delete_graph:')
        log.error(e)
        raise HTTPException(status_code=
            status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="There was an error deleting your graph. Please try again"
        )


@router.get('/{hid}/stats')
async def get_graph_stats(
    user: Annotated[schemas.User, Depends(deps.get_user_from_session)],
    hid: Annotated[str, Depends(deps.get_graph_id)],
    db: Annotated[Session, Depends(deps.get_db)],
):
    try:
        selected_graph = crud.graphs.get(db, id=hid)
        async with ProjectGraphConnection(selected_graph.uuid) as g:
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
                unique_out_edge_counts["series"].append(out_edge_count[0])
                unique_out_edge_counts["labels"].append(entity)

            return {
                "entities": unique_entities,
                "total_entities": total_entities[0],
                "total_relations": total_relations[0],
                "unique_entity_counts": unique_entity_counts,
                "entity_out_edges_count": unique_out_edge_counts
            }
    except Exception as e:
        log.error("Error inside graph.get_graph_stats:")
        log.error(e)
        raise HTTPException(status_code=
            status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="There was an error fetching graphs. Please try reloading the page"
        )
