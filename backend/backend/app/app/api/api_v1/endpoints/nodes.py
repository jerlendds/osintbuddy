from typing import List
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    WebSocket,
    WebSocketException,
    WebSocketDisconnect
)
from websockets.exceptions import ConnectionClosedError
from sqlalchemy.orm import Session
from app.api import deps
from app.core.logger import get_logger
from app.llm.prompts import get_prompt_transform_options
from functools import lru_cache
from osintbuddy.plugins import OBRegistry, discover_plugins
from osintbuddy.errors import OBPluginError

router = APIRouter(prefix='/nodes')

logger = get_logger(' api_v1.endpoints.nodes ')

CORE_LABELS = [
    'GoogleSearch',
    'GoogleCacheSearch',
    'GoogleResult',
    'CseSearch',
    'CseResult',
    'IpAddress',
    'Email',
    'SmtpTest',
    'Domain',
    'Subdomain',
    'URL',
    'urlscanIO',
    'Traceroute',
    'Geolocation',
    'DNSRecord',
    'Username',
    'Profile',
    'Person',
    'Pastebin',
    'Phone',
    'Business',
    'ImageSearch',
    'Image',
    'VideoSearch',
    'Video',
    'News',
    'RSS',
    'MalwareCheck',
    'Malware',
    'NLP',
]


@lru_cache(maxsize=128)
def fetch_node_transforms(plugin_label):
    plugin = OBRegistry.get_plugin(plugin_label=plugin_label)
    if plugin is not None:
        labels = plugin().transform_labels
    else:
        labels = []
    return labels


@router.get('/refresh')
async def refresh_plugins():
    discover_plugins('/app/app/plugins/')
    fetch_node_transforms.cache_clear()
    return {'status': 'success', 'plugins': OBRegistry.ui_labels}


@router.get('/transforms')
async def get_node_transforms(node_type: str):
    return {
        'type': node_type,
        'transforms': fetch_node_transforms(node_type)
    }


@router.get('/type')
async def get_node_option(node_type: str):
    try:
        plugin = OBRegistry.get_plugin(plugin_label=node_type)
        if plugin:
            node = plugin.blueprint()
            node['label'] = node_type
            return node
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=422, detail='pluginNotFound')


def save_transform(results: List[dict]):
    for node in results:
        print(node)


def get_command_type(event):
    user_event = event['action'].split(':')
    action = user_event[0]
    action_type = None
    if len(user_event) >= 2:
        action_type = user_event[1]
    return action, action_type


async def read_graph(node, action_type, send_json):
    await send_json(node)


async def create_nodes(node, action_type, send_json):
    await send_json(node)


async def update_nodes(node, action_type, send_json):
    await send_json(node)


async def remove_nodes(node, action_type, send_json):
    await send_json({'action': 'remove:node', 'node': node})


async def transform_nodes(node, action_type, send_json):
    node_output = {}
    plugin = OBRegistry.get_plugin(node['type'])
    if plugin := plugin():
        transform_type = node['transform']
        node_output = plugin._get_transform(
            transform_type=transform_type,
            node=node,
            get_driver=deps.get_driver,
        )
        if isinstance(node_output, list):
            for output in node_output:
                output['action'] = 'addNode'
                output['position'] = node['position']
                output['parentId'] = node['parentId']
        else:
            node_output['action'] = 'addNode'
            node_output['position'] = node['position']
            node_output['parentId'] = node['parentId']
        await send_json(node_output)


async def execute_event(event, send_json):
    action, action_type = get_command_type(event)
    if action == 'read':
        await read_graph(event['node'], action_type, send_json)
    if action == 'create':
        await create_nodes(event['node'], action_type, send_json)
    if action == 'update':
        await update_nodes(event['node'], action_type, send_json)
    if action == 'delete':
        await remove_nodes(event['node'], action_type, send_json)
    if action == 'transform':
        await transform_nodes(event['node'], action_type, send_json)


@router.websocket('/investigation')
async def active_investigation(
    websocket: WebSocket
):
    await websocket.accept()
    await websocket.send_json({'action': 'refresh'})
    while True:
        try:
            event = await websocket.receive_json()
            await execute_event(
                event=event,
                send_json=websocket.send_json
            )
        except OBPluginError as e:
            print(e)
            await websocket.send_json({'action': 'error', 'detail': f'{e}'})
        except WebSocketDisconnect as e:
            logger.info(e)
        except (WebSocketException, BufferError, ConnectionClosedError) as e:
            logger.error(e)
