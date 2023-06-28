import sys
import json
import ujson
import uuid
from typing import List
from fastapi import (
    APIRouter,
    WebSocket,
    WebSocketException,
    WebSocketDisconnect,
    HTTPException
)
from websockets.exceptions import ConnectionClosedError
from gremlinpy import DriverRemoteConnection, Graph
from gremlinpy.process.graph_traversal import AsyncGraphTraversal
from gremlin_python.process.traversal import T, Cardinality
from gremlin_python.process.graph_traversal import __ as _g
from app.api import deps
from app import schemas
from app.core.logger import get_logger
from osintbuddy import Registry, discover_plugins
from osintbuddy.errors import OBPluginError
from osintbuddy.utils import to_snake_case

router = APIRouter(prefix="/nodes")

logger = get_logger(" api_v1.endpoints.nodes ")

async def fetch_node_transforms(plugin_label):
    plugin = await Registry.get_plugin(plugin_label=plugin_label)
    if plugin is not None:
        labels = plugin().transform_labels
    else:
        labels = []
    return labels


@router.get("/refresh")
async def refresh_plugins():
    # fetch_node_transforms.cache_clear()
    discover_plugins("app/plugins/")
    return {"status": "success", "plugins": Registry.ui_labels}


@router.get("/transforms")
async def get_node_transforms(label: str):
    if label:
        return {
            "type": label,
            "transforms": await fetch_node_transforms(label),
        }
    return {
        "type": None,
        "transforms": None
    }


async def update_node_on_graph(node_type, node, project_uuid=None):
    pass

def build_dict(seq, key):
    return dict((d[key], dict(d, index=index)) for (index, d) in enumerate(seq))


def add_node_element(nodev, element: dict or List[dict], data_labels: List[tuple]):
    print('add_node_element', element)
    # Remove stylistic values unrelated to element data
    label = element.pop('label', None)
    style = element.pop('style', None)
    icon = element.pop('icon', None)
    placeholder = element.pop('placeholder', None)
    options = element.pop('options', None)

    nodev.property(to_snake_case(label), 'node_element', *list(sum(element.items(), ())))
    # Save the data labels so we can assign these as meta properties later
    data_labels.append(to_snake_case(label))

    element['icon'] = icon
    element['label'] = label
    element['style'] = style
    element['placeholder'] = placeholder
    if options:
        element['options'] = options
    return element


async def save_node_to_graph(node_label: str, node_blueprint: dict, project_uuid: str = None):
    async with await DriverRemoteConnection.open('ws://janus:8182/g', 'g') as connection:
        g: AsyncGraphTraversal = Graph().traversal().withRemote(connection)
        v = g.addV(node_label) \
            .property('x', node_blueprint['position']['x']) \
            .property('y', node_blueprint['position']['y'])

        new_labels = []
        for element in node_blueprint['elements']:
            if isinstance(element, list):
                element = [add_node_element(v, elm, new_labels) for elm in element]
            else:
                element = add_node_element(v, element, new_labels)
        v = await v.next()

        await g.V().hasId(v.id) \
            .properties(*new_labels) \
            .valueMap(True) \
            .toList()
    node_blueprint['data'] = {
        'color': node_blueprint.pop('color', '#145070'),
        'icon': node_blueprint.pop('icon', 'atom-2'),
        'style': node_blueprint.pop('style', {}),
        'label': node_blueprint.pop('label'),
        'elements': node_blueprint.pop('elements'),
    }
    node_blueprint['type'] = 'base'
    node_blueprint['id'] = str(v.id)
    return node_blueprint



@router.post('/')
async def get_node_option(node: schemas.CreateNode):
    plugin = await Registry.get_plugin(plugin_label=node.label)
    if plugin:
        blueprint = plugin.blueprint()
        blueprint['position'] = node.position.__dict__
        new_node = await save_node_to_graph(node.label, blueprint)
        print('new_node', new_node)
        return new_node
    raise HTTPException(status_code=422, detail=f'Plugin entity {node.label} can\'t be found.')


def save_transform(results: List[dict]):
    for node in results:
        pass


async def get_command_type(event):
    user_event = event["action"].split(":")
    action = user_event[0]
    action_type = None
    if len(user_event) >= 2:
        action_type = user_event[1]
    return action, action_type


async def read_graph(node, action_type, send_json):
    await send_json(node)


async def create_nodes(node, action_type, send_json):
    print(node)
    await send_json(node)


async def update_nodes(node, action_type, send_json):
    await send_json(node)


async def remove_nodes(node, action_type, send_json):
    await send_json({"action": "remove:node", "node": node})


async def nodes_transform(node, action_type, send_json):
    node_output = {}
    print(node, )
    plugin = await Registry.get_plugin(node.get('data', {}).get('label'))
    if plugin:
        plugin = plugin()
        transform_type = node["transform"]
        node_output = await plugin._get_transform(
            transform_type=transform_type,
            node=node,
            get_driver=deps.get_driver,
        )
        if type(node_output) == list:
            for output in node_output:
                output["action"] = "addNode"
                output["position"] = node["position"]
                output["parentId"] = node["parentId"]
        else:
            node_output["action"] = "addNode"
            node_output["position"] = node["position"]
            node_output["parentId"] = node["parentId"]
        await send_json(node_output)
    else:
        await send_json({'error': 'noPluginFound'})

async def execute_event(event, send_json):
    action, action_type = await get_command_type(event)
    if action == "read":
        await read_graph(event["node"], action_type, send_json)
    if action == "create":
        await create_nodes(event["node"], action_type, send_json)
    if action == "update":
        await update_nodes(event["node"], action_type, send_json)
    if action == "delete":
        await remove_nodes(event["node"], action_type, send_json)
    if action == "transform":
        await nodes_transform(event["node"], action_type, send_json)


@router.websocket("/investigation")
async def active_investigation(websocket: WebSocket):
    await websocket.accept()
    await websocket.send_json({"action": "refresh"})
    while True:
        try:
            event = await websocket.receive_json()
            await execute_event(event=event, send_json=websocket.send_json)
        except OBPluginError as e:
            await websocket.send_json({"action": "error", "detail": f"{e}"})
        except WebSocketDisconnect as e:
            logger.info(e)
        except (WebSocketException, BufferError, ConnectionClosedError) as e:
            logger.error(e)
