import re
import urllib
from typing import List
from pydantic import EmailStr
import requests
from fastapi import HTTPException
from neo4j._sync import work
from app.core.logger import get_logger
from app.api.deps import get_gdb
from app.neomodels.google import GoogleSearch, GoogleResult, get_google_search_results
from app.api.utils import find_emails, to_clean_domain


logger = get_logger(name=" app.api.extractors ")

    
def get_google_results(gdb: work.Session, query: str, pages: int = 3, force_search: str = False):
    existing_results = gdb.execute_read(
        get_google_search_results,
        search_query=query,
        pages=pages
    )
    print(existing_results)
    if len(existing_results) != 0 and force_search is False:
        print('return error', existing_results)
        return list({v['url']: v for v in existing_results}.values())
    
    if not query:
        raise Exception("queryRequired")
    
    try:
        google_resp = requests.get((
            'http://microservice:1323/google?query='
            f'{query.encode("utf8")}&pages={pages}'
        ))
        google_results = google_resp.json()
    except Exception:
        raise Exception("crawlGoogleError")
    
    stats = google_results.get('stats')
    related_searches = []
    result_stats = []
    if stats is not None:
        for stat in stats:
            if res := stat.get('result'):
                result_stats = result_stats + res
            if related := stat.get('related'):
                related_searches = related_searches + related

    search_node = GoogleSearch(
        search_query=query,
        pages=pages,
        related_searches=related_searches,
        result_stats=result_stats
    ).save()

    for key in list(google_results.keys()):
        if key is not None and key != 'stats':
            if google_results.get(key):
                for result in google_results.get(key):
                    result_node = GoogleResult(
                        title=result.get('title', None),
                        description=result.get('description', None),
                        url=result.get('link', None),
                        breadcrumb=result.get('breadcrumb', None),
                        question=result.get('question', None),
                        result_type=key
                    ).save()
                    print(result_node, dir(result_node))
                    search_node.results.connect(result_node)
    search_node.save()
    return gdb.execute_read(get_google_search_results, search_query=query, pages=int(pages))
    


def get_emails_from_google(gdb: work.Session, domain: str = None, pages: int = 10):
    if not domain:
        raise Exception("domainRequired")

    emails_query = 'intext:"@' + to_clean_domain(domain) + '"'

    try:
        results = get_google_results(gdb, emails_query, pages)
    except Exception as e:
        logger.error(e)
        raise Exception("crawlGoogleError")

    emails = []
    print(results)
    for result in results:
        compare = result.get("title", "") + result.get("description", "")
        emails = emails + find_emails(compare)
    print('emails', emails)
    return [email for email in emails if email.find(domain) != -1]
