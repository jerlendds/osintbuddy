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
    data = {"query": query, 'user_id': current_user_id, 'user_search_id': user_search_id, 'search_id': search_id}
    spider_response = requests.post("http://spider:7242/start", json=data)
    print(spider_response.text)
    # crawl_status = spider_response.json()
    return {"search_meta": spider_response.text}
