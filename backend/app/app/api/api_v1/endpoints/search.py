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
    Create new search.
    """
    print("HELLO", search_in)
    search = crud.search.create_with_owner(db=db, obj_in=search_in)
    return search


