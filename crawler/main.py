#!/usr/bin/env python
# -*- coding: utf-8 -*-
import datetime
from queue import Queue

from fastapi import FastAPI
from pydantic import BaseModel

from scrapyloop import ScrapyLoop
from crawler.spiders.cse import CseSpider


app = FastAPI()


class CrawlRequestSchema(BaseModel):
    query: str
    user_id: int
    user_search_id: int
    search_id: int


class CrawlResponseSchema(CrawlRequestSchema):
    created: datetime.datetime


crawl_queue = Queue()

crawl_scheduler = ScrapyLoop(success_interval=5, crash_interval=15, empty_interval=10)
crawl_scheduler.crawl_callback(crawl_queue.get)


@app.post('/start', response_model=CrawlResponseSchema)
def start_crawl(search_in: CrawlRequestSchema):
    data = search_in.dict()
    crawl_queue.put(data)
    try:
        crawl_scheduler.loop_crawl(CseSpider, crawl_queue.qsize, **data)
    except Exception as e:
        print("TODO...:", e)
    finally:
        data['created'] = datetime.datetime.now()
        return CrawlResponseSchema(**data)
