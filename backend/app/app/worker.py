#!/usr/bin/env python
# -*- coding: utf-8 -*-
from raven import Client
import requests

from app.core.celery_app import celery_app
from app.core.config import settings

client_sentry = Client(settings.SENTRY_DSN)


@celery_app.task(acks_late=True)
def test_celery(word: str) -> str:
    return f"test task return {word}"


@celery_app.task(acks_late=True)
def start_cse_crawl(query: str, current_user_id: int, user_search_id: int, search_id: int) -> dict:
    """Celery App
    WARNING: Weird error on first search, POST request gets no response #TODO: Troubleshoot me

    Communicate with Scrapy crawler server and spawn a spider that will save Google CSE results to the database.
    0-100 Search results will be saved for every CSE link on
    the crawler service (last count: 1175 CSE links, max CSE results per search: 117500).
    One user_search instance has search.id FK
    one search_result has a search_id FK to search

    # TODO: Add args to pass in CSE links,
    # TODO: add filtering by category/CSE link on the frontend,
    # TODO: update CSE spider to accept links args (null coalscing with default = List of 1175 links)

    # TODO: Add pagination
    """
    data = {"query": query, "user_id": current_user_id, "user_search_id": user_search_id, "search_id": search_id}
    spider_response = requests.post("http://spider:7242/start", json=data)  # this is the crawler service
    # was having occasional JSON decoding error below? ...
    # for now json.dumps where this is used will suffice
    # crawl_status = spider_response.json()
    return {"search_meta": spider_response.text}
