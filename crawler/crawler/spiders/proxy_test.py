#!/usr/bin/env python
# -*- coding: utf-8 -*-
import scrapy


search_input_xpath = '//*[@id="gsc-i-id1"]'


class ProxySpider(scrapy.Spider):
    name = "proxy"
    allowed_domains = ["ipapi.co"]


    start_urls = ["https://ipapi.co/json/"]


    def start_requests(self):
        for url in self.start_urls:
            yield scrapy.Request(url=url, callback=self.parse, meta={

                })

    def parse(self, response):  # noqa
        yield response.json()
