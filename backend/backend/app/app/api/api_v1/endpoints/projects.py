import uuid
import asyncio
from fastapi import (
    APIRouter,
    HTTPException,
    Depends
)
from gremlinpy import Cluster
from gremlinpy.exception import GremlinServerError
from app.api import deps
from sqlalchemy.orm import Session
from app import crud, schemas

router = APIRouter(prefix="/projects")


@router.get('')
async def get_project(
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
        print(e)
    finally:
        await cluster.close()
    return new_project


@router.delete('')
async def delete_project(
    id: int,
    db: Session = Depends(deps.get_db),
):
    if id:
        return crud.projects.remove(db=db, id=id)
    else:
        raise HTTPException(status_code=422, detail='ID is a required field')
