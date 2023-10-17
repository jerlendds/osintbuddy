import asyncio
from contextlib import asynccontextmanager
from typing import List, Callable, Tuple, Any, AsyncIterator
from fastapi import (
    APIRouter,
    WebSocket,
    WebSocketException,
    WebSocketDisconnect,
    HTTPException,
    Depends
)
from gremlinpy import DriverRemoteConnection, Graph, Cluster
from gremlinpy.process.graph_traversal import AsyncGraphTraversal
from app.core.config import settings

@asynccontextmanager
async def ProjectGraphConnection(
    project_uuid: str,
    host: str = settings.JANUSGRAPH_HOST,
    port: int = settings.JANUSGRAPH_PORT
) -> AsyncIterator[AsyncGraphTraversal]:
    cluster = await Cluster.open(
        asyncio.get_event_loop(),
        **{'hosts': [host], 'port': port}
    )
    client = await cluster.connect(hostname='janus')
    # await client.submit(f'project_{project_uuid}.io(IoCore.graphson()).writeGraph("data.json")')
    print(f'connecting traversal: project_{project_uuid}_traversal')
    async with await DriverRemoteConnection.using(
        cluster,
        {'g': f'project_{project_uuid.replace("-", "")}_traversal'}
    ) as connection:
        yield Graph().traversal().withRemote(connection)

