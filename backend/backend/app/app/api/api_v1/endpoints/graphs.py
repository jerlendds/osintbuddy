import uuid
import asyncio

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
from app.db.janus import ProjectGraphConnection

log = get_logger("api_v1.endpoints.graphs")
router = APIRouter(prefix="/graphs")

@router.get('/{graph_id}', operation_id="get_graph")
async def get_project(
    graph_id: str,
    db: Session = Depends(deps.get_db),
):
    graph_project = crud.projects.get_by_uuid(
        db=db,
        uuid=graph_id
    )
    return {"graph": graph_project}


@router.put('/{graph_id}/favorite', operation_id="update_favorite_graph_uuid")
async def get_project(
    graph_id: str,
    is_favorite: bool = False,
    db: Session = Depends(deps.get_db),
):
    db_obj = crud.projects.get_by_uuid(
        db=db,
        uuid=graph_id
    )
    updated_graph = crud.projects.update_favorite_by_uuid(db, db_obj=db_obj, is_favorite=is_favorite)
    return updated_graph

@router.get('', operation_id="get_graphs")
async def get_project(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    is_favorite: bool = False
):
    if limit > 50:
        limit = 50
    db_projects = crud.projects.get_many_by_favorites(
        db=db,
        skip=skip,
        limit=limit,
        is_favorite=is_favorite
    )
    return {"projects": db_projects, "count": crud.projects.count_by_favorites(db, is_favorite)[0][0]}


@router.post('', operation_id="create_graph")
async def create_project(
    name: str,
    db: Session = Depends(deps.get_db),
    description: str = '',
):
    project_uuid = uuid.uuid4().hex
    create_project_graph = f"""
map = new HashMap<>()
map.put('storage.backend', 'cql')
map.put('storage.hostname', 'sdb:9042')
map.put('index.search.backend', 'solr')
map.put('index.search.solr.mode', 'http')
map.put('index.search.solr.http-urls', 'http://index:8983/solr')
map.put('graph.graphname', 'project_{project_uuid}')
ConfiguredGraphFactory.createConfiguration(new MapConfiguration(map))
ConfiguredGraphFactory.open('project_{project_uuid}')
    """
    obj_in = schemas.ProjectCreate(
        name=name,
        description=description,
        uuid=project_uuid
    )
    new_project = crud.projects.create(db=db, obj_in=obj_in)
    cluster = await Cluster.open(
        asyncio.get_event_loop(),
        **{'hosts': ['janus'], 'port': 8182}
    )
    try:
        client = await cluster.connect(hostname='janus')
        await client.submit(create_project_graph)
    except GremlinServerError as e:
        log.error(e)
    finally:
        await cluster.close()
        return new_project


@router.delete('', operation_id = "delete_graph")
async def delete_project(
    uuid: str,
    db: Session = Depends(deps.get_db),
):
    if uuid:
        crud.projects.remove_by_uuid(db=db, uuid=uuid)
    else:
        raise HTTPException(status_code=422, detail='UUID is a required field')


@router.get('/{graph_id}/stats', operation_id="get_graph_stats")
async def get_unique_graph_labels(
    graph_id: str,
    db: Session = Depends(deps.get_db)
):
    if not graph_id:
        raise HTTPException(status_code=422, detail='graph_id is a required field')
    async with ProjectGraphConnection(graph_id) as g:
        unique_entities = await g.V().label().dedup().toList()
        total_entites = await g.V().count().toList()
        total_relations = await g.E().count().toList()
        
        unique_entity_counts = {"series": [], "labels": []}
        unique_oute_counts = {"series": [], "labels": []}
        
        for entity in unique_entities:
          entity_count = await g.V().hasLabel(entity).count().toList()
          unique_entity_counts["series"].append(entity_count[0])
          unique_entity_counts["labels"].append(entity)

          oute_count = await g.V().hasLabel(entity).outE().count().toList()
          unique_oute_counts['series'].append(oute_count[0])
          unique_oute_counts['labels'].append(entity)
          
        return {
            "entities": unique_entities,
            "total_entities": total_entites[0],
            "total_relations": total_relations[0],
            "unique_entity_counts": unique_entity_counts,
            "entity_oute_counts": unique_oute_counts
        }
