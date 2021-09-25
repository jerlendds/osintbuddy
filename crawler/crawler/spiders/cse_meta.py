#!/usr/bin/env python
# -*- coding: utf-8 -*-
import json
import scrapy


class CseSourceLinks:
    def __init__(self):
        self.src_ids = ["EL84Km",
                        "b5ynOQ",
                        "L1rEYQ",
                        "8ynloB",
                        "b5Aow7",
                        "b56G5Q",
                        "Wp1kpe",
                        "BnBb5v",
                        "b59RMv",
                        "GEQXv7",
                        "m65arv",
                        "6rAJbo",
                        "ZeDvrP"]

    def __next__(self):
        return self.src_ids

    def __iter__(self):
        for cse_id in self.src_ids:
            yield f"https://start.me/p/{cse_id}.json"


class CseMetaSpider(scrapy.Spider):
    name = "cse_meta"
    allowed_domains = ["start.me"]
    custom_settings = {
        'ITEM_PIPELINES': {
            'crawler.cse_meta_pipeline.CseMetaPipeline': 400
        }
    }

    def start_requests(self):
        for url in CseSourceLinks():
            yield scrapy.Request(url=url, callback=self.parse_link_columns)

    # Lots of loops :(
    def parse_link_columns(self, response):  # noqa
        all_cse = []
        cse_count = 0
        not_cse_count = 0

        data = json.loads(response.text)
        cse_categories = data["page"]["sections"][0]["columns"]
        for widget in cse_categories:
            for osint_link_sets in widget.get('widgets'):
                contains_links = osint_link_sets['items'] != {}
                if contains_links:
                    cse_set = {
                        "category": osint_link_sets.get('title'),
                        "links": []
                    }
                else:
                    break
                for cse_resource in osint_link_sets['items']['links']:
                    url = cse_resource['url']
                    # TODO: Research if any other urls are valid/invalid
                    valid_cse_url = ['http://cse.google.',  # noqa
                                     'https://cse.google']

                    if url[:18] in valid_cse_url:
                        cse_count += 1
                        cse_resource = {
                            "title": cse_resource["title"],
                            "url": cse_resource["url"]
                        }
                        cse_set['links'].append(cse_resource)
                if len(cse_set['links']) >= 1:
                    yield cse_set
