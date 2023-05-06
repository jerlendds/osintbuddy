import json
from fastapi import APIRouter, Depends, HTTPException, WebSocket
from sqlalchemy.orm import Session
from app.api import deps

router = APIRouter(prefix='/nodes')

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


def get_graph_labels(tx):
    return [label for sub_list in tx.run("CALL db.labels()").values()
            for label in sub_list]


def create_graph_labels(tx, labels):
    tx.run(f"CREATE (n:{':'.join(labels)})")


@router.get('/')
async def get_node_options(
    gdb: Session = Depends(deps.get_gdb),
):
    data = []
    try:
        data = gdb.execute_read(get_graph_labels)
        if len(data) == 0:
            gdb.execute_write(create_graph_labels, labels=CORE_LABELS)
            data = CORE_LABELS
    except Exception:
        raise HTTPException(status_code=508, detail='unknownError')
    return data


def create_new_node():
    pass


def update_node_state():
    pass


ACTION_WRITE = 'create'
ACTION_UPDATE = 'update'
ACTION_REMOVE = 'delete'
ACTION_READ = 'read'
ACTION_TRANSFORM = 'transform'

ACTION_TYPE_NODE = 'node'


def get_plugin(node_type: str):
    return None


def delete_node(tx, node_id):
    pass


@router.websocket('/investigation')
async def active_investigation(
    websocket: WebSocket,
    gdb: Session = Depends(deps.get_gdb),
):
    await websocket.accept()
    while True:
        raw_command = await websocket.receive_json()
        command = raw_command['action'].split(':')
        action = command[0]

        action_type = None
        if len(command) >= 2:
            action_type = command[1]

        IS_NODE = action_type == ACTION_TYPE_NODE

        if action == ACTION_READ:
            if IS_NODE:
                node = raw_command[ACTION_TYPE_NODE]
                await websocket.send_json(node)
        if action == ACTION_WRITE:
            if IS_NODE:
                node = raw_command[ACTION_TYPE_NODE]
                await websocket.send_json(node)
        if action == ACTION_UPDATE:
            if IS_NODE:
                node = raw_command[ACTION_TYPE_NODE]
                await websocket.send_json(node)
        if action == ACTION_REMOVE:
            if IS_NODE:
                node = raw_command[ACTION_TYPE_NODE]
                gdb.execute_write(delete_node, node_id=node['id'])
                await websocket.send_text('pending:update')
        if action == ACTION_TRANSFORM:
            if IS_NODE:
                result_nodes = []
                node = raw_command[ACTION_TYPE_NODE]
                plugin = get_plugin(node['type'])
                if plugin:
                    transform_type = command[2]
                    result_nodes = plugin.get_transform(transform_type, node)
                await websocket.send_json(result_nodes)

        print('command', action, action_type)
        await websocket.send_text(action)
