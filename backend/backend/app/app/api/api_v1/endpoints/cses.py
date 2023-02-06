from typing import Any, List
from datetime import datetime
import urllib.parse
import requests
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.crud.base import get_or_create
from app import crud, schemas, models
from app.api import deps

router = APIRouter(prefix='/cses')


@router.get('/links')
def get_cse_links(
    current_user: models.User = Depends(deps.get_current_active_user),
    db: Session = Depends(deps.get_db),
    id: int = 0
):
    try:
        resp = requests.get('https://gist.githubusercontent.com/jerlendds/741d110f59a7d2ed2098325d30b00569/raw/dd7ec7584c6c939d97b7c0ace92c28e289a8a959/cses.json') 
        if resp.status_code == 200:
            return resp.json()
        else:
            raise HTTPException(status_code=422, detail="cseFetchError")
    except Exception:
        raise HTTPException(status_code=422, detail="cseFetchError")
