from typing import Any, List
from datetime import datetime
import urllib.parse
import requests
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, schemas, models
from app.api import deps
from app.core.logger import get_logger

router = APIRouter(prefix='/cses')

logger = get_logger(name="/cses")

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
    except Exception as e:
        raise HTTPException(status_code=422, detail="cseFetchError")


@router.get('/crawl')
def crawl_cse_links(
    current_user: models.User = Depends(deps.get_current_active_user),
    db: Session = Depends(deps.get_db),
    pages: int = 1,
    query: str = None,
    url: str = None
):
    print(query, pages, url)
    if query is None or url is None:
        raise HTTPException(status_code=422, detail="queryRequired")
    
    parsed_url = urllib.parse.urlparse(url)
    cse_id = urllib.parse.parse_qs(parsed_url.query)['cx'][0]
    
    
    try:

        
        resp = requests.get(f'http://microservice:1323/google-cse?query={query}&pages={pages}&id={cse_id}')
        return resp.json()
    
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=422, detail="cseFetchError")
