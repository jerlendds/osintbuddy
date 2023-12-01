from uuid import UUID
from typing import List, Callable, Tuple, Any, Annotated
from fastapi import APIRouter, WebSocket, WebSocketException, WebSocketDisconnect, HTTPException, Depends
from websockets.exceptions import ConnectionClosedError
from gremlinpy.process.graph_traversal import AsyncGraphTraversal
from gremlin_python.process.graph_traversal import __ as _g
from gremlin_python.process.traversal import T, Cardinality
from osintbuddy.utils import to_snake_case, MAP_KEY, chunks
from osintbuddy import Registry, PluginUse, load_plugins
from osintbuddy.errors import OBPluginError
from sqlalchemy.orm import Session
from starlette import status

from app.api import deps
from app import schemas, crud
from app.core.logger import get_logger
from app.db.janus import ProjectGraphConnection


log = get_logger("api_v1.endpoints.nodes")
router = APIRouter(prefix="/node")


async def fetch_node_transforms(plugin_label):
    plugin = await Registry.get_plugin(plugin_label=plugin_label)
    if plugin is not None:
        labels = plugin().transform_labels
        return labels



def add_node_element(vertex, element: dict or List[dict], data_labels: List[str]):
    # Remove stylistic values unrelated to element data
    # Some osintbuddy.elements of type displays dont have an icon or options 
    icon = element.pop('icon', None)
    options = element.pop('options', None)

    label = element.pop('label')
    placeholder = element.pop('placeholder')
    elm_type = element.pop('type')
    if elm_type == 'empty':
        return
    if value := element.get('value'):
        vertex.property(to_snake_case(label), value)
    else:
        [
            vertex.property(f'{to_snake_case(label)}_{to_snake_case(k)}', v)
            for k, v in element.items()
        ]
    # Save the data labels so we can assign these as meta properties later
    data_labels.append(to_snake_case(label))

    element['type'] = elm_type
    element['icon'] = icon
    element['label'] = label
    element['placeholder'] = placeholder
    if options:
        element['options'] = options
    return element


async def save_node_to_graph(
    graph: AsyncGraphTraversal,
    node_label: str,
    position: dict,
    blueprint: dict = None,
    add_edge: dict = {}
) -> Tuple[Any, List[str]]:
    v = graph.addV(to_snake_case(node_label)) \
            .property('x', position.get('x', 0.0)) \
            .property('y', position.get('y', 0.0))
    if not blueprint:
        return await v.next()

    new_labels = []
    for element in blueprint['elements']:
        if isinstance(element, list):
            [add_node_element(v, elm, new_labels) for elm in element]
        else:
            add_node_element(v, element, new_labels)
    
    new_entity = await v.next()
    # TODO: support adding optional kwargs to edge properties

    if add_edge.get('id') and add_edge.get('label'):
        source: AsyncGraphTraversal = graph.V().hasId(new_entity.id)
        target: AsyncGraphTraversal = graph.V().hasId(add_edge['id'])
        await target.addE(add_edge['label']).to(source).next()
    await graph.V().hasId(new_entity.id) \
        .properties(*new_labels) \
        .valueMap(True) \
        .toList()
    return new_entity


async def save_node_on_drop(
    node_label: str,
    node_blueprint: dict,
    uuid: UUID
):
    async with ProjectGraphConnection(uuid) as g:
        new_entity = await save_node_to_graph(g, node_label, node_blueprint.get('position', {}))
        node_blueprint['data'] = {
            'color': node_blueprint.pop('color', '#145070'),
            'icon': node_blueprint.pop('icon', 'atom-2'),
            'label': node_blueprint.pop('label'),
            'elements': node_blueprint.pop('elements'),
        }
        node_blueprint['type'] = 'base'
        node_blueprint['id'] = str(new_entity.id)
    return node_blueprint



async def load_initial_graph(uuid: UUID) -> tuple[list, list]:
    async with ProjectGraphConnection(uuid) as graph:
        edges: list = await graph.V().outE().project('from', 'edge', 'to')\
            .by(_g.outV()).by(_g.valueMap(True)).by(_g.inV()).union(
            _g.select('edge').unfold(),
            _g.project('from').by(_g.select('from')).unfold(),
            _g.project('to').by(_g.select('to')).unfold()
        ).fold().toList()
        nodes: list = await graph.V().valueMap(True).toList()
        return nodes, edges


def map_node_to_blueprint_elements(blueprint, map_element, node) -> None:
    data_keys = node.keys()
    obmap = {}
    if len(data_keys) > 1:
        for d_key in data_keys:
            key_split = d_key.split(MAP_KEY)
            if len(key_split) >= 2:
                obmap[key_split[1]] = d_key

    data_label = to_snake_case(map_element['label'])
    if node.get(data_label):
        map_element['value'] = node[data_label][0]
    else:
        for k, v in obmap.items():
            map_element[k] = node[v][0]


async def read_graph(action_type, send_json, project_uuid):
    nodes = []
    data_nodes, edges = await load_initial_graph(project_uuid)
    for node in data_nodes:
        position = {
            'x': node.pop('x', [0])[0],
            'y': node.pop('y', [0])[0]
        }
        entity_id = node.pop(T.id)
        label_data = node.pop(T.label)
        plugin = await Registry.get_plugin(to_snake_case(label_data))
        blueprint = plugin.blueprint()
        
        for element in blueprint['elements']:
            if isinstance(element, list):
                for elm in element:
                    map_node_to_blueprint_elements(
                        blueprint,
                        elm,
                        node
                    )
            else:
                map_node_to_blueprint_elements(
                    blueprint,
                    element,
                    node
                )
        blueprint['position'] = position
        blueprint['id'] = f"{entity_id}"
        blueprint['type'] = 'mini'
        blueprint['data'] = {
            'color': blueprint.pop('color'),
            'icon': blueprint.pop('icon', 'atom-2'),
            'label': blueprint.pop('label'),
            'elements': blueprint.pop('elements'),
        }
        nodes.append(blueprint)
    edges_data = []
    if len(edges[0]) >= 1:
        [edges_data.append({
            'id': f"{i}", 
            'source': f"{e[2]['from'].id}",
            'target': f"{e[3]['to'].id}",
            'label': e[1][T.label],
            'type': 'float'
        }) for i, e in enumerate(chunks(edges[0], 4))]
    await send_json({
        'action': 'addInitialLoad',
        'nodes': nodes,
        'edges': edges_data
    })


async def update_node(node, action_type, send_json, uuid: UUID):
    if updateTargetId := node.pop('id', None):
        async with ProjectGraphConnection(uuid) as graph:
            updateTarget = graph.V(updateTargetId)
            for k, v in node.items():
                await updateTarget.property(Cardinality.single, to_snake_case(k), v).next()
            node['id'] = updateTargetId


async def remove_nodes(node, action_type, send_json, uuid: UUID):
    async with ProjectGraphConnection(uuid) as graph:
        if targetNode := node.get('id'):
            await graph.V(targetNode).drop().next()
    await send_json({"action": "remove:node", "node": node})


async def nodes_transform(
    node: dict,
    send_json: Callable[[dict], None],
    uuid: UUID
):
    node_output = {}
    plugin = await Registry.get_plugin(node.get('data', {}).get('label'))
    if plugin := plugin():
        transform_type = node["transform"]
        node_output = await plugin.get_transform(
            transform_type=transform_type,
            node=node,
            use=PluginUse(
                get_driver=deps.get_driver,
                get_graph=lambda: None
            )
        )
        async def create_node_transform_context(
            graph: AsyncGraphTraversal,
            transform_ctx: dict,
            node_transform: dict
        ):
            edge_label = transform_ctx.pop('edge_label', None)
            new_entity = await save_node_to_graph(
                graph,
                transform_ctx.get('label'),
                node_transform.get('position', {}),
                transform_ctx,
                {
                    'id': node_transform['id'],
                    'label': edge_label
                } if edge_label else {}
            )
            transform_ctx['data'] = {
                'color': transform_ctx.pop('color', '#145070'),
                'icon': transform_ctx.pop('icon', 'atom-2'),
                'label': transform_ctx.pop('label'),
                'elements': transform_ctx.pop('elements'),
            }
            transform_ctx['id'] = str(new_entity.id)
            transform_ctx['type'] = 'mini'
            transform_ctx["action"] = "addNode"
            transform_ctx["position"] = node_transform["position"]
            transform_ctx["parentId"] = node_transform["id"]

        async with ProjectGraphConnection(uuid) as graph:
            if isinstance(node_output, list):
                [await create_node_transform_context(graph, n, node) for n in node_output]
            else:
                await create_node_transform_context(graph, node_output, node)
        await send_json(node_output)
    else:
        await send_json({'error': 'noPluginFound'})


async def get_command_type(event):
    user_event: list = event["action"].split(":")
    action = user_event[0]
    USER_ACTION = None
    if len(user_event) >= 2:
        USER_ACTION = user_event[1]
    IS_READ = action == "read"
    IS_UPDATE = action == "update"
    IS_DELETE = action == "delete"
    IS_TRANSFORM = action == "transform"
    return USER_ACTION, IS_READ, IS_UPDATE, IS_DELETE, IS_TRANSFORM


async def execute_event(event: dict, send_json: Callable, uuid: UUID) -> None:
    USER_ACTION, IS_READ, IS_UPDATE, IS_DELETE, IS_TRANSFORM = await get_command_type(event)
    if USER_ACTION == 'node':
        if IS_READ:
            await read_graph(USER_ACTION, send_json, uuid)
        if IS_UPDATE:
            await update_node(event["node"], USER_ACTION, send_json, uuid)
        if IS_DELETE:
            await remove_nodes(event["node"], USER_ACTION, send_json, uuid)
        if IS_TRANSFORM:
            await nodes_transform(event["node"], send_json, uuid)


@router.websocket("/graph/{hid}")
async def active_graph_inquiry(
    websocket: WebSocket,
    user: Annotated[schemas.User, Depends(deps.get_user_from_ws)],
    hid: Annotated[int, Depends(deps.get_graph_id)],
    db: Session = Depends(deps.get_db)
):
    await websocket.accept()
    is_project_active = True
    active_inquiry = crud.graphs.get(db, id=hid)
    if active_inquiry is None:
        is_project_active = False
    else:
        await websocket.send_json({"action": "refresh"})

    while is_project_active:
        try:
            event: dict = await websocket.receive_json()
            await execute_event(
                event=event,
                send_json=websocket.send_json,
                uuid=active_inquiry.uuid
            )
        except OBPluginError as e:
            await websocket.send_json({"action": "error", "detail": f"Unhandled plugin error! {e}"})
        except WebSocketDisconnect as e:
            log.error(e)
        except (WebSocketException, BufferError, ConnectionClosedError) as e:
            log.error("Exception inside node.active_project")
            log.error(e)
            is_project_active = False
    await websocket.close()


@router.get("/refresh")
async def refresh_plugins(
    hid: Annotated[str, Depends(deps.get_graph_id)],
    user: Annotated[schemas.User, Depends(deps.get_user_from_session)],
    db: Session = Depends(deps.get_db)
):
    try:
        Registry.plugins = []
        Registry.labels = []
        Registry.ui_labels = []
        entities = crud.entities.get_many(db, skip=0, limit=100)
        load_plugins(entities)
        return {"status": "success", "plugins": Registry.ui_labels}
    except Exception as e:
        log.error("Error inside node.refresh_plugins")
        log.error(e)
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="There was an error refreshing, please try again."
        )


@router.post("/")
async def create_graph_entity(
    hid: Annotated[str, Depends(deps.get_graph_id)],
    user: Annotated[schemas.User, Depends(deps.get_user_from_session)],
    node: schemas.CreateNode,
    db: Session = Depends(deps.get_db)
):
    try:
        active_inquiry = crud.graphs.get(db, id=hid)
        plugin = await Registry.get_plugin(plugin_label=to_snake_case(node.label))
        if plugin:
            blueprint = plugin.blueprint()
            blueprint["position"] = node.position.dict()
            return await save_node_on_drop(
                node.label,
                blueprint,
                active_inquiry.uuid
            )
        raise HTTPException(status_code=422, detail=f"Plugin entity {node.label} cannot be found.")
    except Exception as e:
        log.error("Error inside node.create_graph_entity")
        log.error(e)
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="There was an error refreshing, please try again."
        )
