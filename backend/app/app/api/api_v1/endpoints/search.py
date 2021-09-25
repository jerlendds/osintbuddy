from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

router = APIRouter()



@router.post("/", response_model=schemas.Search)
def create_search(
    *,
    db: Session = Depends(deps.get_db),
    search_in: schemas.search.SearchCreate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new search, authentication required
    """
    print("HELLO", search_in, current_user.id)
    search = crud.search.create_with_owner(db=db, obj_in=search_in)
    print("SEARCH", search)

    user_search_in = schemas.user_search.UserSearchCreate(**{'user_id': current_user.id, 'search_id': search.id})
    user_search = crud.user_search.create(db=db, obj_in=user_search_in)
    print("USER_SEARCH", user_search.id, user_search.search_id, user_search.user_id)
    return search


