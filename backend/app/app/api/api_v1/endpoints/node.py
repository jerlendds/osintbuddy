from uuid import UUID
from typing import List, Callable, Tuple, Any, Annotated, Dict
from fastapi import APIRouter, WebSocket, WebSocketException, WebSocketDisconnect, HTTPException, Depends
from sqlalchemy import or_
from websockets.exceptions import ConnectionClosedError
from gremlinpy.process.graph_traversal import AsyncGraphTraversal
from gremlin_python.process.graph_traversal import __ as _g
from gremlin_python.process.traversal import P
from gremlin_python.process.traversal import T, Cardinality
from osintbuddy.utils import to_snake_case, MAP_KEY, chunks
from osintbuddy import EntityRegistry, TransformUse
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

async def load_nodes_from_db(uuid: UUID, viewport=None) -> tuple[list, list]:
    zoom_scale = viewport.get('zoom')
    # x = viewport.get('x')
    # y = viewport.get('y')

    async with ProjectGraphConnection(uuid) as graph:
        edges: list = await graph.V().outE().project('from', 'edge', 'to')\
            .by(_g.outV()).by(_g.valueMap(True)).by(_g.inV()).union(
            _g.select('edge').unfold(),
            _g.project('from').by(_g.select('from')).unfold(),
            _g.project('to').by(_g.select('to')).unfold()
        ).fold().toList()
        # TODO: Load/update UI nodes on far drag
        # TODO: unload nodes UI side when off screen offset by max drag distance
        # y = viewport.get('y')
        nodes: list = await graph.V()\
            .valueMap(True).toList()
            # .has('y', P.between(y, y2))\
            # \
            # .has('y', P.lt(y)).has('y', P.gt(y_offset))\
            # .has('x', P.gt(x))\
            # .has('x', P.between(x1, x2))\
        # .has('y', P.between(y1, y2))\
            # .or_(_g.has('x', P.gt(x1)), _g.has('x', P.lt(x2)))
            # maybe something like the above?!
            
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


async def read_graph(viewport_event, send_json, project_uuid, is_initial_read: bool = False):
    nodes = []
    edges_data = []
    data_nodes, edges = await load_nodes_from_db(project_uuid, viewport_event)
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
            ui_entity = plugin.create()
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
            # TODO detect invalid/renamed entities/plugins on any plugin label updates and fix graph
            tmp_invalid_id_fix.append(entity_id)
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
        'action': 'isInitialRead' if is_initial_read else 'read',
        'nodes': nodes,
        'edges': edges_data
    })


async def update_node(node, send_json, uuid: UUID):
    if updateTargetId := node.pop('id', None):
        async with ProjectGraphConnection(uuid) as graph:
            updateTarget = graph.V(updateTargetId)
            for k, v in node.items():
                # if k == 'x' or k == 'y':
                    # print(to_snake_case(k), v)
                updateTarget.property(Cardinality.single, to_snake_case(k), v)
            await updateTarget.next()


async def remove_nodes(node, send_json, uuid: UUID):
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
    entity_context: dict,
    send_json: Callable[[dict], None],
    uuid: UUID
):
    transform_result = {}
    transform_type = entity_context.get("transform")
    entity_data = entity_context.get("data", {})
    entity_type = entity_data.get("label")
    plugin = await EntityRegistry.get_plugin(entity_type)
    if plugin := plugin():
        transform_result = await plugin.run_transform(
            transform_type=transform_type,
            transform_context=entity_context,
            use=TransformUse(get_driver=deps.get_driver)
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
                out_result = [await create_entity_data(graph, result, entity_context) for result in transform_result]
            else:
                out_result = list(await create_entity_data(graph, transform_result, entity_context))
        transform_notification = await get_transform_notification(transform_result, transform_type)
        
        await send_json({ 
            "action": "isLoading",
            "detail": False,
            "message": transform_notification
        })
        await send_json({
            "action": "createEntity",
            "results": out_result
        })
    else:
        await send_json({'error': 'noPluginFound'})


async def run_user_graph_event(event: dict, send_json: Callable, uuid: UUID) -> None:
    user_event: list = event["action"].split(":")
    action = user_event[0]
    IS_READ: bool = action == "read"
    IS_UPDATE: bool = action == "update"
    IS_DELETE: bool = action == "delete"
    IS_TRANSFORM: bool = action == "transform"
    IS_INITIAL: bool = 'initial' in action

    ACTION_TARGET = user_event[1]

    if ACTION_TARGET == 'node':
        if IS_UPDATE:
            await update_node(event["node"], send_json, uuid)
        if IS_DELETE:
            await remove_nodes(event["node"], send_json, uuid)
        if IS_TRANSFORM:
            await send_json({"action": "isLoading", "detail": True })
            await nodes_transform(event["node"], send_json, uuid)
    if ACTION_TARGET == 'graph':
        if IS_READ:
            await read_graph(event["viewport"], send_json, uuid)
            await send_json({ "action": "isLoading", "detail": False, "message": "Success! You've been reconnected!" })
        if IS_INITIAL:
            await send_json({"action": "isLoading", "detail": True })
            await read_graph(event["viewport"], send_json, uuid, True)
            await send_json({ "action": "isLoading", "detail": False, "message": "Success! Your graph environment has loaded!" })


# TODO: Finish implementing 'multiplayer' logic
graph_users: Dict[str, WebSocket] = {}

@router.websocket("/graph/{hid}")
async def active_graph_inquiry(
    websocket: WebSocket,
    user: Annotated[schemas.UserInDBBase, Depends(deps.get_user_from_ws)],
    hid: Annotated[int, Depends(deps.get_graph_id)],
    db: Session = Depends(deps.get_db)
):
    graph_users[user.cid.hex] = websocket  
    active_inquiry = crud.graphs.get(db, id=hid)

    await websocket.accept()
    if active_inquiry is not None:
        await graph_users[user.cid.hex].send_json({"action": "isLoading", "detail": True })
    else:
        websocket.send({"action": "error"})

    for user_cid, ws in graph_users.items():
        while True:
                try:
                    async for event in ws.iter_json():
                        await run_user_graph_event(
                            event=event,
                            send_json=ws.send_json,
                            uuid=active_inquiry.uuid
                        )
                except OBPluginError as e:
                    await ws.send_json({"action": "error", "detail": f"{e}"})
                    await ws.send_json({"action": "isLoading", "detail": False })
                    log.error(e)
                except (WebSocketException, ConnectionClosedError) as e:
                    log.error("Exception inside node.active_project")
                    log.error(e)
                    await ws.send_json({"action": "isLoading", "detail": False })
                    await ws.close()
                    del graph_users[user_cid]
                except (WebSocketDisconnect, RuntimeError) as e:
                    if isinstance(e, RuntimeError):
                        log.error(e)
                    log.info(f"disconnect! {user_cid}")
                    del graph_users[user_cid]


@router.get("/refresh")
async def refresh_entity_plugins(
    hid: Annotated[str, Depends(deps.get_graph_id)],
    user: Annotated[schemas.UserInDBBase, Depends(deps.get_user_from_session)],
    db: Session = Depends(deps.get_db)
):
    # try:
    EntityRegistry.discover_plugins()
    return {"status": "success", "plugins": EntityRegistry._visible_entities}
    # except Exception as e:
    #     log.error("Error inside node.refresh_plugins")
    #     log.error(e)
    #     raise HTTPException(
    #         status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
    #         detail="There was an error refreshing, please try again."
    #     )


@router.post("/")
async def create_entity_on_drop(
    hid: Annotated[str, Depends(deps.get_graph_id)],
    user: Annotated[schemas.UserInDBBase, Depends(deps.get_user_from_session)],
    create_node: schemas.CreateNode,
    db: Session = Depends(deps.get_db)
):
    try:
        active_inquiry = crud.graphs.get(db, id=hid)
        plugin = await EntityRegistry.get_plugin(plugin_label=to_snake_case(create_node.label))
        if plugin:
            blueprint = plugin.create()
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
