from contextlib import asynccontextmanager
from typing import AsyncIterator
from gremlinpy import DriverRemoteConnection, Graph, Cluster
from gremlinpy.process.graph_traversal import AsyncGraphTraversal
from app.core.config import settings

@asynccontextmanager
async def ProjectGraphConnection(
    graph_uuid: str,
    host: str = settings.JANUSGRAPH_HOST,
    port: int = settings.JANUSGRAPH_PORT
) -> AsyncIterator[AsyncGraphTraversal]:
    cluster = await Cluster.open(**{'hosts': [host], 'port': port})
    client = await cluster.connect(hostname='janus')
    print(f'connecting traversal: graph_{graph_uuid}_traversal')
    async with await DriverRemoteConnection.using(
        cluster,
        {'g': f'graph_{graph_uuid.replace("-", "")}_traversal'}
    ) as connection:
        yield Graph().traversal().withRemote(connection)


janus_create_db = lambda graph_uuid: f"""
map = new HashMap<>()
map.put('storage.backend', 'cql')
map.put('storage.hostname', 'sdb:9042')
map.put('index.search.backend', 'solr')
map.put('index.search.solr.mode', 'http')
map.put('index.search.solr.http-urls', 'http://index:8983/solr')
map.put('graph.graphname', 'graph_{graph_uuid}')
ConfiguredGraphFactory.createConfiguration(new MapConfiguration(map))
ConfiguredGraphFactory.open('graph_{graph_uuid}')
"""