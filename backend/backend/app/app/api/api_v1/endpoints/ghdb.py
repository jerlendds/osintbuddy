from typing import Any, List
from datetime import datetime
import requests
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.crud.base import get_or_create
from app import crud, schemas, models
from app.api import deps

router = APIRouter(prefix='/ghdb')


@router.get('/author')
def get_author(
    db: Session = Depends(deps.get_db),
    id: int = 0
):
    return crud.dork_authors.get(db=db, id=id)


@router.get('/category')
def get_category(
    db: Session = Depends(deps.get_db),
    id: int = 0
):
    return crud.dork_categories.get(db=db, id=id)


@router.get('/authors')
def get_authors(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 0
):
    if (limit > 100):
        limit = 100
    return crud.dork_authors.get_multi(db=db, skip=skip, limit=limit)


@router.get('/categories', response_model=List[schemas.DorkCategoriesInDBBase])
def get_categories(
    db: Session = Depends(deps.get_db),
):
    return crud.dork_categories.get_multi(db=db, skip=0, limit=50)


@router.get('/dorks/count')
def get_dorks_count(
    db: Session = Depends(deps.get_db),
):
    return {
        "dorksCount":  crud.google_dorks.count_all(db=db)[0][0],
        "authorsCount":  crud.dork_authors.count_all(db=db)[0][0],
        "categoriesCount":  crud.dork_categories.count_all(db=db)[0][0]
    }


@router.get('/dorks')
def get_dorks(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 0,
    filter: int = None
):
    if (limit > 100):
        limit = 100

    # the 'all' filter is set as a negative client side
    if filter > 0:
        dork_data = crud.google_dorks.get_multi_by_category(
            db=db,
            skip=skip,
            limit=limit,
            category_id=filter
        )
        count = crud.google_dorks.count_all_by_category(
            db=db,
            category_id=filter
        )[0][0]
    else:
        dork_data = crud.google_dorks.get_multi(db=db, skip=skip, limit=limit)
        count = crud.google_dorks.count_all(db=db)[0][0]

    return {
        "dorks":  dork_data,
        "dorksCount": count,
    }


@router.post("/update")
def update_ghdb_data(
    db: Session = Depends(deps.get_db),
) -> Any:
    import requests
    headers = {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:102.0) Gecko/20100101 Firefox/102.0',
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Accept-Language': 'en-US,en;q=0.5',
        'Referer': 'https://www.exploit-db.com/google-hacking-database',
        'X-Requested-With': 'XMLHttpRequest',
        'Connection': 'keep-alive',
        'Cookie': '',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
    }

    params = {
        'draw': '2',
        'columns[0][data]': 'date',
        'columns[0][name]': 'date',
        'columns[0][searchable]': 'true',
        'columns[0][orderable]': 'true',
        'columns[0][search][value]': '',
        'columns[0][search][regex]': 'false',
        'columns[1][data]': 'url_title',
        'columns[1][name]': 'url_title',
        'columns[1][searchable]': 'true',
        'columns[1][orderable]': 'false',
        'columns[1][search][value]': '',
        'columns[1][search][regex]': 'false',
        'columns[2][data]': 'cat_id',
        'columns[2][name]': 'cat_id',
        'columns[2][searchable]': 'true',
        'columns[2][orderable]': 'false',
        'columns[2][search][value]': '',
        'columns[2][search][regex]': 'false',
        'columns[3][data]': 'author_id',
        'columns[3][name]': 'author_id',
        'columns[3][searchable]': 'false',
        'columns[3][orderable]': 'false',
        'columns[3][search][value]': '',
        'columns[3][search][regex]': 'false',
        'order[0][column]': '0',
        'order[0][dir]': 'desc',
        'start': '0',
        'length': '10000',
        'search[value]': '',
        'search[regex]': 'false',
        'author': '',
        'category': '',
        '_': '1671480527623',
    }

    response = requests.get(
        'https://www.exploit-db.com/google-hacking-database',
        params=params, 
        headers=headers
    )
    ghdb_response = response.json()
    dorks = ghdb_response.get('data', [])
    for dork in dorks:
        try:
            author_name = dork.get('author_id')[1]
            category_obj = dork.get('category')
            date_str = dork.get('date')
            google_dork = dork.get('url_title')
            date = datetime.strptime(date_str, '%Y-%m-%d')
            category_title = category_obj.get('cat_title')
            category_description = category_obj.get('cat_description')

            author = get_or_create(db, models.Dork_Authors, name=author_name)
            category = get_or_create(
                db,
                models.Dork_Categories,
                name=category_title,
                description=category_description
            )
            get_or_create(
                db,
                models.Google_Dorks,
                dork=google_dork,
                date=date,
                category_id=category.id,
                author_id=author.id
            )
        except Exception as e:
            print(e)

    return {
        'status': 'success'
    }


@router.get('/cses')
def get_cse_links(
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
