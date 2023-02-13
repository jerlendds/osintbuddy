import urllib
from typing import Any
import requests
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, schemas, models
from app.api import deps
from app.neomodels.google import GoogleResult, GoogleSearch, get_google_search_results
from app.core.logger import get_logger
from app.api.extractors import get_google_results


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
    results = get_google_results(gdb, query, pages, force_search)
    return results
