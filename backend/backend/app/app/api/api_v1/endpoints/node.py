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
    label = element.pop('label', None)
    data_label = (
        label,
        label.strip().lower().replace(' ', '_'),
        element.get('style', {}),
        element.get('icon', 'atom-2'),
        element.get('placeholder', ''),
        element.get('options', None)
    )
    # Remove element plugin values unrelated to data
    
    element.pop('style', None)
    element.pop('icon', None)
    element.pop('placeholder', None)
    element.pop('options', None)

    nodev.property(data_label[1], 'node_element', *list(sum(element.items(), ())))
    element['label'] = label
    # Save element plugin values unrelated to data to be re-added later
    data_labels.insert(len(data_labels) - 1, data_label)
    return element


async def save_node_to_graph(node_label: str, node_blueprint: dict, project_uuid: str = None):
    async with await DriverRemoteConnection.open('ws://janus:8182/g', 'g') as connection:
        g: AsyncGraphTraversal = Graph().traversal().withRemote(connection)
        position = node_blueprint.get('position')
        print(position, '?????')
        v = g.addV(node_label) \
            .property('x', position.get('x', 0.0)) \
            .property('y', position.get('y', 0.0))

        data_labels = []
        for element in node_blueprint['elements']:
            if isinstance(element, list):
                element = [add_node_element(v, elm, data_labels) for elm in element]
            else:
                element = add_node_element(v, element, data_labels)

        v = await v.next()


        graph_node = await g.V().hasId(v.id) \
            .properties(*[label[1] for label in data_labels]) \
            .valueMap(True) \
            .toList()
        graph_node = graph_node
        # Apply other element plugin values that were removed
        for element in graph_node:
            element_styles = [
                elm for elm in data_labels
                if elm[1] == element[T.key]
            ][0]
            element['label'] = element_styles[0]
            element['style'] = element_styles[2]
            element['icon'] = element_styles[3]
            element['placeholder'] = element_styles[4]
            # only the osintbuddy.elements.DropdownInput has an options key
            if element_styles[5]:
                element['options'] = element_styles[5]

            del element[T.id]
            del element[T.key]
            del element[T.value]
        # del node_blueprint['elements']
    drop_position = node_blueprint.pop('position')
    node_blueprint['position'] = {
        'x': drop_position.pop('x', 0.0),
        'y': drop_position.pop('y', 0.0)
    }
    ret = []
    for idx, element in enumerate(node_blueprint['elements']):
        if isinstance(element, list):
            print('islist',)
            ret.append([])
            for elm in element:
                if elm.get('label') == graph_node[idx].get('label'):
                     ret[len(ret) - 1].append(graph_node[idx])
            print('appending',ret[len(ret) - 1], )
        else:
            print('isnot list')
            if element.get('label') == graph_node[idx].get('label'):
                print('appending', graph_node[idx])
                ret.append(graph_node[idx])
    print('graph_node', graph_node)
    print('ret', ret)   
    node_blueprint['data'] = {
        'color': node_blueprint.pop('color', '#145070'),
        'icon': node_blueprint.pop('icon', 'atom-2'),
        'style': node_blueprint.pop('style', {}),
        'label': node_blueprint.pop('label'),
        'elements': graph_node,
    }
    node_blueprint['type'] = 'base'
    node_blueprint['id'] = str(v.id)
    return node_blueprint



@router.post('/')
async def get_node_option(node: schemas.CreateNode):
    plugin = await Registry.get_plugin(plugin_label=node.label)
    if plugin:
        blueprint = plugin.blueprint()
        print(node, node.position, node.position.__dict__, dir(node.position))
        blueprint['position'] = node.position.__dict__
        print('node.label', node.label)
        new_node = await save_node_to_graph(node.label, blueprint)
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
