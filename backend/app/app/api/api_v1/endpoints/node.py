from uuid import UUID
from typing import List, Callable, Tuple, Any, Annotated
from fastapi import APIRouter, WebSocket, WebSocketException, WebSocketDisconnect, HTTPException, Depends
from websockets.exceptions import ConnectionClosedError
from gremlinpy.process.graph_traversal import AsyncGraphTraversal
from gremlin_python.process.graph_traversal import __ as _g
from gremlin_python.process.traversal import T, Cardinality
from osintbuddy.utils import to_snake_case, MAP_KEY, chunks
from osintbuddy import EntityRegistry, TransformCtx, load_local_plugins
from osintbuddy.errors import OBPluginError
from sqlalchemy.orm import Session
from starlette import status

from app.api import deps
from app import schemas, crud
from app.core.logger import get_logger
from app.db.janus import ProjectGraphConnection
from app.core.config import settings

log = get_logger("api_v1.endpoints.nodes")
router = APIRouter(prefix="/node")

# TODO: Refactor to somewhere that makes sense...
def refresh_local_entities(db: Session):
    EntityRegistry.plugins = []
    EntityRegistry.labels = []
    EntityRegistry.ui_labels = []
    entities = crud.entities.get_many(db, skip=0, limit=100)
    load_local_plugins(entities)


async def fetch_node_transforms(plugin_label):
    plugin = await EntityRegistry.get_plugin(plugin_label=plugin_label)
    if plugin is not None:
        labels = plugin().transform_labels
        return labels



def add_node_element(vertex, element: dict or List[dict], data_labels: List[str]):
    # Remove stylistic values unrelated to element data
    # Some osintbuddy.elements of type displays dont have an icon or options 

    icon = element.pop('icon', None)
    options = element.pop('options', None)

    label = element.pop('label')
    elm_type = element.pop('type')

    if elm_type == 'empty':
        return
    if value := element.get('value'):
        vertex.property(to_snake_case(label), value)
    else:
        for k, v in element.items():
            vertex.property(f'{to_snake_case(label)}_{to_snake_case(k)}', v)
    # Save the data labels so we can assign these as meta properties later
    data_labels.append(to_snake_case(label))

    element['type'] = elm_type
    element['icon'] = icon
    element['label'] = label
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
    node_label,
    blueprint: dict,
    uuid: UUID
):
    async with ProjectGraphConnection(uuid) as g:
        new_entity = await save_node_to_graph(g, node_label, blueprint["position"])

    return {
        "id": f"{new_entity.id}",
        "type": "edit",
        "data": {
            'color': blueprint.pop('color', '#145070'),
            'icon': blueprint.pop('icon', 'atom-2'),
            'label': blueprint.pop('label'),
            'elements': blueprint.pop('elements'),
        }
    }

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


def node_to_blueprint_entity(ui_entity_element, node) -> None:
    node_element_labels = node.keys()
    obmap = {}
    if len(node_element_labels) > 1:
        for d_key in node_element_labels:
            key_split = d_key.split(MAP_KEY)
            if len(key_split) > 1:
                obmap[key_split[1]] = d_key
            else:
                obmap[key_split[0]] = ""
    entity_label = to_snake_case(ui_entity_element['label'])
    if node.get(entity_label):
        ui_entity_element['value'] = node[entity_label][0]
    else:
        json_element = {k: v for k, v in obmap.items() if entity_label in k}
        for k, v in json_element.items():
            if entity_label not in k:
                ui_entity_element[k] = node[v][0]

async def read_graph(action_type, send_json, project_uuid):
    nodes = []
    edges_data = []
    data_nodes, edges = await load_initial_graph(project_uuid)
    tmp_invalid_fix = []
    tmp_invalid_id_fix = []
    for node in data_nodes:
        position = {
            'x': node.pop('x', [0])[0],
            'y': node.pop('y', [0])[0]
        }
        entity_id = node.pop(T.id)
        entity_type = node.pop(T.label)
        plugin = await EntityRegistry.get_plugin(to_snake_case(entity_type))
        if plugin:
            ui_entity = plugin.blueprint()
            for element in ui_entity['elements']:
                if isinstance(element, list):
                    [node_to_blueprint_entity(
                        elm,
                        node
                    ) for elm in element]
                else:
                    node_to_blueprint_entity(
                        element,
                        node
                    )
            ui_entity['position'] = position
            ui_entity['id'] = f"{entity_id}"
            ui_entity['type'] = "view"
            ui_entity['data'] = {
                'color': ui_entity.pop('color'),
                'icon': ui_entity.pop('icon', 'atom-2'),
                'label': ui_entity.pop('label'),
                'elements': ui_entity.pop('elements'),
            }
            nodes.append(ui_entity)
        else:
            tmp_invalid_id_fix.append(entity_id)
            # TODO detect invalid/renamed entities/plugins on any plugin label updates and fix graph
            tmp_invalid_fix.append(entity_type)
            print(f'(TODO: on entity code update and label change rename nodes in janusgraph) Error Invalid Plugin: {entity_type}')
    if len(edges[0]) > 0:
        for i, e in enumerate(chunks(edges[0], 4)):
            source = e[2]['from'].id
            target = e[3]['to'].id
            # TODO: actually fix me, dont keep this messy hack
            valid_source = source not in tmp_invalid_id_fix
            valid_target = target not in tmp_invalid_id_fix
            if valid_source and valid_target:
                edges_data.append({
                    'id': f"{i}",
                    'source': f"{source}",
                    'target': f"{target}",
                    'label': e[1][T.label],
                    'type': 'float'
                })
    await send_json({
        'action': 'isInitialRead',
        'nodes': nodes,
        'edges': edges_data
    })


async def update_node(node, action_type, send_json, uuid: UUID):
    if updateTargetId := node.pop('id', None):
        async with ProjectGraphConnection(uuid) as graph:
            updateTarget = graph.V(updateTargetId)
            for k, v in node.items():
                updateTarget.property(Cardinality.single, to_snake_case(k), v)
            await updateTarget.next()


async def remove_nodes(node, action_type, send_json, uuid: UUID):
    async with ProjectGraphConnection(uuid) as graph:
        if targetNode := node.get('id'):
            await graph.V(targetNode).drop().next()
    await send_json({"action": "removeEntity", "node": node})


async def get_transform_notification(transform_output, transform_type):
    notification_msg = f'Transform {transform_type.lower()} '
    if len(transform_output) > 0:
        notification_msg = notification_msg + f'returned {len(transform_output)} '
        if len(transform_output) > 1:
            notification_msg = notification_msg + "entities!"
        else:
            notification_msg = notification_msg + "entity!"
    else:
        notification_msg = notification_msg + " found no results!"
    return notification_msg


async def nodes_transform(
    node: dict,
    send_json: Callable[[dict], None],
    uuid: UUID
):
    transform_result = {}
    entity_type = node.get('data', {}).get('label')
    transform_type = None
    plugin = await EntityRegistry.get_plugin(entity_type)
    if plugin := plugin():
        transform_type = node["transform"]
        transform_result = await plugin.get_transform(
            transform_type=transform_type,
            entity=node,
            use=TransformCtx(
                get_driver=deps.get_driver,
                get_graph=lambda: None
            )
        )
        async def create_entity_data(
            graph: AsyncGraphTraversal,
            result: dict,
            entity_source: dict
        ):
            """
            Map entity elements returned from transform
            """
            edge_label = None
            if result:
                edge_label = result.pop('edge_label', None)
            new_entity = await save_node_to_graph(
                graph,
                result.get('label'),
                entity_source.get('position'),
                result,
                {
                    'id': entity_source['id'],
                    'label': edge_label
                } if edge_label else {}
            )
            return {
                "id": f"{new_entity.id}",
                "type": "edit",
                "action": "createEntity",
                "position": entity_source["position"],
                "parentId": entity_source["id"],
                "data": {
                    "color": result.pop("color"),
                    "icon": result.pop("icon"),
                    "label": result.pop("label"),
                    "elements": result.pop("elements"),
                }
            }

        async with ProjectGraphConnection(uuid) as graph:
            if isinstance(transform_result, list):
                out_result = [await create_entity_data(graph, result, node) for result in transform_result]
            else:
                out_result = list(await create_entity_data(graph, transform_result, node))
        await send_json({ 
            "action": "isLoading",
            "detail": False,
            "message": await get_transform_notification(transform_result, transform_type) 
        })
        await send_json({
            "action": "createEntity",
            "results": out_result
        })
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


async def run_user_graph_event(event: dict, send_json: Callable, uuid: UUID) -> None:
    USER_ACTION, IS_READ, IS_UPDATE, IS_DELETE, IS_TRANSFORM = await get_command_type(event)
    if USER_ACTION == 'node':
        if IS_READ:
            await send_json({"action": "isLoading", "detail": True })
            await read_graph(USER_ACTION, send_json, uuid)
            await send_json({ "action": "isLoading", "detail": False, "message": "Success! Your graph environment has loaded!" }) 
        if IS_UPDATE:
            await update_node(event["node"], USER_ACTION, send_json, uuid)
        if IS_DELETE:
            await remove_nodes(event["node"], USER_ACTION, send_json, uuid)
        if IS_TRANSFORM:
            await send_json({"action": "isLoading", "detail": True })
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
        await websocket.send_json({"action": "isLoading", "detail": True })

    while is_project_active:
        try:
            event: dict = await websocket.receive_json()
            await run_user_graph_event(
                event=event,
                send_json=websocket.send_json,
                uuid=active_inquiry.uuid
            )
        except OBPluginError as e:
            await websocket.send_json({"action": "error", "detail": f"{e}"})
            await websocket.send_json({"action": "isLoading", "detail": False })
            log.error(e)
        except (WebSocketException, BufferError, ConnectionClosedError) as e:
            await websocket.send_json({"action": "isLoading", "detail": False })
            log.error("Exception inside node.active_project")
            log.error(e)
            is_project_active = False
            await websocket.close()
        except WebSocketDisconnect as e:
            log.info(f"disconnected!")

@router.get("/refresh")
async def refresh_plugins(
    hid: Annotated[str, Depends(deps.get_graph_id)],
    user: Annotated[schemas.User, Depends(deps.get_user_from_session)],
    db: Session = Depends(deps.get_db)
):
    try:
        refresh_local_entities(db)
        return {"status": "success", "plugins": EntityRegistry.ui_labels}
    except Exception as e:
        log.error("Error inside node.refresh_plugins")
        log.error(e)
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="There was an error refreshing, please try again."
        )


@router.post("/")
async def create_entity_on_drop(
    hid: Annotated[str, Depends(deps.get_graph_id)],
    user: Annotated[schemas.User, Depends(deps.get_user_from_session)],
    create_node: schemas.CreateNode,
    db: Session = Depends(deps.get_db)
):
    try:
        active_inquiry = crud.graphs.get(db, id=hid)
        plugin = await EntityRegistry.get_plugin(plugin_label=to_snake_case(create_node.label))
        if plugin:
            blueprint = plugin.blueprint()
            blueprint["position"] = create_node.position.model_dump()
            return await save_node_on_drop(
                create_node.label,
                blueprint,
                active_inquiry.uuid
            )
        raise HTTPException(status_code=422, detail=f"Plugin entity {create_node.label} cannot be found.")
    except Exception as e:
        log.error("Error inside node.create_graph_entity")
        log.error(e)
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="There was an error refreshing, please try again."
        )
