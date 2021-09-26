#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os
import datetime

from fastapi import FastAPI
from pydantic import BaseModel
from twisted.internet import defer
from twisted.internet import reactor
from twisted.internet.error import ReactorAlreadyRunning, ReactorNotRestartable
from scrapy.crawler import CrawlerRunner

from crawler.spiders.cse import CseSpider
from crawler.spiders.cse_meta import CseMetaSpider


class SpiderProcess(object):
    update_meta = os.environ.get('UPDATE_CSE_META', False)

    def __init__(self):
        settings_path = "spiderman.crawler.settings"
        os.environ.setdefault('SCRAPY_SETTINGS_MODULE', settings_path)

        if self.update_meta:
            os.environ['UPDATE_CSE_META'] = 'false'
        self.runner = CrawlerRunner()
        self.spider_cse = CseSpider
        self.spider_meta = CseMetaSpider

    @defer.inlineCallbacks
    def run_crawl(self):
        if self.update_meta:
            d = self.runner.crawl(self.spider_meta).addBoth(lambda _: reactor.stop())
        else:
            d = self.runner.crawl(self.spider_cse).addBoth(lambda _: reactor.stop())
        yield d


app = FastAPI()


class CrawlRequestSchema(BaseModel):
    query: str
    user_id: int
    user_search_id: int


class CrawlResponseSchema(CrawlRequestSchema):
    created: datetime.datetime


@app.post('/start', response_model=CrawlResponseSchema)
def start_crawl(search_in: CrawlRequestSchema):
    print(search_in.dict())
    base = SpiderProcess()
    base.run_crawl()
    try:
        reactor.run(installSignalHandlers=False)
    except (ReactorAlreadyRunning, ReactorNotRestartable):
        pass
    data = search_in.dict()
    data['created'] = datetime.datetime.now()
    return CrawlResponseSchema(**data)
