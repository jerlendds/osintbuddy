from raven import Client
import requests

from app.core.celery_app import celery_app
from app.core.config import settings

client_sentry = Client(settings.SENTRY_DSN)


@celery_app.task(acks_late=True)
def test_celery(word: str) -> str:
    return f"test task return {word}"


@celery_app.task(acks_late=True)
def start_cse_crawl(query: str) -> str:
    # TODO: Implement me, currently working on the crawler service then will implement this
    # requests.post("http://")
    return f"Searching for {query}"
