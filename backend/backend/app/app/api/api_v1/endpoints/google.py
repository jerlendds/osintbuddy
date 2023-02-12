import urllib
from typing import Any
import requests
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, schemas, models
from app.api import deps
from app.neomodels.google import GoogleResult, GoogleSearch, get_google_search_results

router = APIRouter(prefix='/extract/google')

 
@router.get('/search', response_model=Any)
def get_search_results(
    current_user: models.User = Depends(deps.get_current_active_user),
    gdb: Session = Depends(deps.get_gdb),
    pages: int = 1,
    query: str = None,
    force_search: bool = False
):
    existing_results = gdb.execute_read(get_google_search_results, search_query=query, pages=int(pages))
    print('existing_results', existing_results)
    if existing_results and force_search is False:
        return list({v['url']: v for v in existing_results}.values())
    
    if not query:
        raise HTTPException(status_code=422, detail="Query is required")
  
    try:
        encoded_query = urllib.parse.quote(query.encode('utf8'))
        google_resp = requests.get(f'http://microservice:1323/google?query={encoded_query}&pages={pages}')
        google_results = google_resp.json()
    except Exception:
        raise HTTPException(status_code=422, detail="crawlGoogleError")
        
    stats = google_results.get('stats', None)
    related_searches = []
    result_stats = []
    for stat in stats:
        related_searches = related_searches + stat.get('related')
        result_stats = result_stats + stat.get('result')

    search_node = GoogleSearch(
        search_query=query,
        pages=int(pages),
        related_searches=related_searches,
        result_stats=result_stats
    ).save()
    
    for key in google_results.keys():
        valid_result = key is not None and key != 'stats'
        if valid_result:
            for result in google_results[key]:
                result_node = GoogleResult(
                    title=result.get('title', None),
                    description=result.get('description', None),
                    url=result.get('link', None),
                    breadcrumb=result.get('breadcrumb', None),
                    question=result.get('question', None),
                    result_type=key
                ).save()
                search_node.results.connect(result_node)
    return google_results
