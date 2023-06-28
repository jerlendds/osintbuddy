import datetime
import requests
from sqlalchemy.orm import Session
from app import crud, schemas, models
from app.core.config import settings
from app.core.logger import get_logger
from app.crud.base import get_or_create
from app.crud.crud_google_dorks import dorks as crud_dorks

# make sure all SQL Alchemy models are imported (app.db.base) before initializing DB
from .base import *  # noqa https://github.com/tiangolo/full-stack-fastapi-postgresql/issues/28

logger = get_logger(name=__name__)


def init_db(db: Session) -> None:
    
    if crud_dorks.count_all(db)[0][0] == 0:
        headers = {
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:102.0) Gecko/20100101 Firefox/102.0",
            "Accept": "application/json, text/javascript, */*; q=0.01",
            "Accept-Language": "en-US,en;q=0.5",
            "Referer": "https://www.exploit-db.com/google-hacking-database",
            "X-Requested-With": "XMLHttpRequest",
            "Connection": "keep-alive",
            "Cookie": "",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
        }

        params = {
            "draw": "2",
            "columns[0][data]": "date",
            "columns[0][name]": "date",
            "columns[0][searchable]": "true",
            "columns[0][orderable]": "true",
            "columns[0][search][value]": "",
            "columns[0][search][regex]": "false",
            "columns[1][data]": "url_title",
            "columns[1][name]": "url_title",
            "columns[1][searchable]": "true",
            "columns[1][orderable]": "false",
            "columns[1][search][value]": "",
            "columns[1][search][regex]": "false",
            "columns[2][data]": "cat_id",
            "columns[2][name]": "cat_id",
            "columns[2][searchable]": "true",
            "columns[2][orderable]": "false",
            "columns[2][search][value]": "",
            "columns[2][search][regex]": "false",
            "columns[3][data]": "author_id",
            "columns[3][name]": "author_id",
            "columns[3][searchable]": "false",
            "columns[3][orderable]": "false",
            "columns[3][search][value]": "",
            "columns[3][search][regex]": "false",
            "order[0][column]": "0",
            "order[0][dir]": "desc",
            "start": "0",
            "length": "10000",
            "search[value]": "",
            "search[regex]": "false",
            "author": "",
            "category": "",
            "_": "1671480527623",
        }

        response = requests.get(
            "https://www.exploit-db.com/google-hacking-database",
            params=params,
            headers=headers,
        )
        ghdb_response = response.json()
        dorks = ghdb_response.get("data", [])
        for dork in dorks:
            try:
                author_name = dork.get("author_id")[1]
                category_obj = dork.get("category")
                date_str = dork.get("date")
                google_dork = dork.get("url_title")
                date = datetime.datetime.strptime(date_str, "%Y-%m-%d")
                category_title = category_obj.get("cat_title")
                category_description = category_obj.get("cat_description")

                author = get_or_create(db, models.Dork_Authors, name=author_name)
                category = get_or_create(
                    db,
                    models.Dork_Categories,
                    name=category_title,
                    description=category_description,
                )
                get_or_create(
                    db,
                    models.Google_Dorks,
                    dork=google_dork,
                    date=date,
                    category_id=category.id,
                    author_id=author.id,
                )
            except Exception as e:
                print('Error fetching google dorks. Restart the backend to attempt the fetch again.')
    return [
        {
            "status": "success",
            "service": "[Database: Create]",
            "message": "Configuring database from .env settings...",
        }
    ]
