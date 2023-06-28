from typing import Any, List
from datetime import datetime


import requests
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.crud.base import get_or_create
from app import crud, schemas, models
from app.api import deps

router = APIRouter(prefix="/ghdb")


@router.get("/author")
def get_author(db: Session = Depends(deps.get_db), id: int = 0):
    return crud.dork_authors.get(db=db, id=id)


@router.get("/category")
def get_category(db: Session = Depends(deps.get_db), id: int = 0):
    return crud.dork_categories.get(db=db, id=id)


@router.get("/authors")
def get_authors(
    db: Session = Depends(deps.get_db), skip: int = 0, limit: int = 0
):
    if limit > 100:
        limit = 100
    return crud.dork_authors.get_multi(db=db, skip=skip, limit=limit)


@router.get("/categories", response_model=List[schemas.DorkCategoriesInDBBase])
def get_categories(
    db: Session = Depends(deps.get_db),
):
    return crud.dork_categories.get_multi(db=db, skip=0, limit=50)


@router.get("/dorks/count")
def get_dorks_count(
    db: Session = Depends(deps.get_db),
):
    return {
        "dorksCount": crud.dorks.count_all(db=db)[0][0],
        "authorsCount": crud.dork_authors.count_all(db=db)[0][0],
        "categoriesCount": crud.dork_categories.count_all(db=db)[0][0],
    }


@router.get("/dorks")
def get_dorks(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 0,
    filter: int = None,
):
    if limit > 100:
        limit = 100

    # the 'all' filter is set as a negative client side
    if filter > 0:
        dork_data = crud.dorks.get_multi_by_category(
            db=db, skip=skip, limit=limit, category_id=filter
        )
        count = crud.dorks.count_all_by_category(
            db=db, category_id=filter
        )[0][0]
    else:
        dork_data = crud.dorks.get_multi(db=db, skip=skip, limit=limit)
        count = crud.dorks.count_all(db=db)[0][0]

    return {
        "dorks": dork_data,
        "dorksCount": count,
    }


@router.get("/cses")
def get_cse_links(db: Session = Depends(deps.get_db), id: int = 0):
    try:
        resp = requests.get(
            "https://gist.githubusercontent.com/jerlendds/741d110f59a7d2ed2098325d30b00569/raw/dd7ec7584c6c939d97b7c0ace92c28e289a8a959/cses.json"
        )
        if resp.status_code == 200:
            return resp.json()
        else:
            raise HTTPException(status_code=422, detail="cseFetchError")
    except Exception:
        raise HTTPException(status_code=422, detail="cseFetchError")
