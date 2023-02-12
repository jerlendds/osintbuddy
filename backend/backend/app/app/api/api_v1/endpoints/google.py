import urllib
from typing import Any
import requests
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, schemas, models
from app.api import deps
from app.neomodels.google import GoogleResult, GoogleSearch, get_google_search_results
from app.core.logger import get_logger

logger = get_logger(name=" /extract/google ")


router = APIRouter(prefix='/extract/google')

 
@router.get('/search', response_model=Any)
def get_search_results(
    current_user: models.User = Depends(deps.get_current_active_user),
    gdb: Session = Depends(deps.get_gdb),
    pages: int = 1,
    query: str = None,
    force_search: str = False
):
    existing_results = gdb.execute_read(get_google_search_results, search_query=query, pages=int(pages))
    if len(existing_results) != 0 and force_search is False:
        return list({v['url']: v for v in existing_results}.values())
    
    if not query:
        raise HTTPException(status_code=422, detail="Query is required")

    try:
        encoded_query = urllib.parse.quote(query.encode('utf8'))
        google_resp = requests.get(f'http://microservice:1323/google?query={encoded_query}&pages={pages}')
        google_results = google_resp.json()
        print('GOOGLE', google_results)
    except Exception:
        raise HTTPException(status_code=422, detail="crawlGoogleError")
        
    stats = google_results.get('stats', [])
    related_searches = []
    result_stats = []
    if stats is not None:
        for stat in stats:
            if res := stat.get('result'):
                result_stats = result_stats + res
            if related := stat.get('related'):
                related_searches = related_searches + related

    search_node = GoogleSearch(
        search_query=query,
        pages=int(pages),
        related_searches=related_searches,
        result_stats=result_stats
    ).save()
    for key in list(google_results.keys()):
        if key is not None and key != 'stats':
            logger.info(f'key {key}')
            if google_results.get(key):
                for result in google_results.get(key):
                    result_node = GoogleResult(
                        title=result.get('title', None),
                        description=result.get('description', None),
                        url=result.get('link', None),
                        breadcrumb=result.get('breadcrumb', None),
                        question=result.get('question', None),
                        result_type=key
                    ).save()
                    print(result_node, dir(result_node))
                    search_node.results.connect(result_node)
    search_node.save()
    return gdb.execute_read(get_google_search_results, search_query=query, pages=int(pages))
    
