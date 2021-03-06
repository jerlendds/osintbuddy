import datetime
import json
from typing import Any, List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps
from app.worker import start_cse_crawl

router = APIRouter()


@router.post("/", response_model=schemas.SearchMetaData)
def create_search(
    *,
    db: Session = Depends(deps.get_db),
    search_in: schemas.search.SearchCreate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> schemas.SearchMetaData:
    """
    Create new search Google CSE search for all links, authentication required.

    If authenticated spins up a Scrapy Google CSE spider that spawns somewhat quickly and begins saving
    Google CSE results for `query` to the database.
    """
    search = crud.search.create_with_owner(db=db, obj_in=search_in)

    user_search_data = {'user_id': current_user.id, 'search_id': search.id}
    user_search_in = schemas.user_search.UserSearchCreate(**user_search_data)
    user_search = crud.user_search.create(db=db, obj_in=user_search_in)
    # TODO: Hits celery queue? but flower is still broken :( also need to research how
    #  bad root user is for celery running in docker
    crawler_response = start_cse_crawl(search.query, current_user.id, user_search.id, search.id)

    crawler_data = json.loads(crawler_response.get('search_meta'))
    crawler_data['last_updated'] = datetime.datetime.now()
    crawler_data['search_id'] = search.id
    return schemas.SearchMetaData(**crawler_data)


@router.get("/history", response_model=schemas.UserSearchHistory)
def get_search_history(
    *,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> schemas.UserSearchHistory:
    """
    Return search history for signed in user
    """
    history_data = [crud.search.get(db, id=record.search_id)
                    for record in crud.user_search.get_user_search_history(db, current_user_id=current_user.id)]
    return schemas.UserSearchHistory(**{"searchHistory": history_data})


@router.get("/", response_model=Any) # List[schemas.SearchResult]
def get_search(
        *,
        db: Session = Depends(deps.get_db),
        current_user: models.User = Depends(deps.get_current_active_user),
        searchId: int,  # noqa
        limit: int,
        offset: int
) -> Any:
    """
    TODO: Create Model for results response, create max result return limit..
     how much filtering should be done client side?
    """
    data = crud.search_result.get_by_limit_offset(db, searchId, limit, offset)
    total_results_count = crud.search_result.get_count(db, searchId)
    return {"total_results": total_results_count, "results_count": len(data), "results": data}
