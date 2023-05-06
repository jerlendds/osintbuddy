from typing import Any, List
from datetime import datetime
import urllib.parse
import requests
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, schemas, models
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
    'Telegram',
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
    return [label for sub_list in tx.run("CALL db.labels()").values() for label in sub_list]


def create_graph_labels(tx, labels):
    pass


@router.get('/')
def get_node_options(
    gdb: Session = Depends(deps.get_gdb),
):
    data = []
    try:
        data = gdb.execute_read(get_graph_labels)
        if len(data) == 0:
            gdb.execute_write(create_graph_labels)
    except Exception:
        raise HTTPException(code=508, detail='unknownError')
    return data
