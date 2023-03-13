import json
from typing import Any, List
from datetime import datetime
import urllib.parse
import requests
from fastapi import APIRouter, WebSocket, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, schemas, models
from app.api import deps


router = APIRouter(prefix='/terminal')


@router.websocket('')
async def create_node(
    websocket: WebSocket,
    # current_user: models.User = Depends(deps.get_current_active_user),
    current_user: schemas.User = Depends(deps.get_current_ws_user)
):
    await websocket.accept()
    while True:
        try:
            data = await websocket.receive_text()
            await websocket.send_json({'sent': data})
        except RuntimeError:
            break
