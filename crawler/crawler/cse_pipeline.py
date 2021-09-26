#!/usr/bin/env python
# -*- coding: utf-8 -*-
from .database import db
from scrapy.exceptions import DropItem


class CsePipeline:
    def open_spider(self, spider):
        pass

    def close_spider(self, spider):
        pass

    def process_item(self, item, spider):
        results = item.get('results')
        if results and len(results) > 0:
            for result in results:
                serp = {
                    'title': result.get('titleNoFormatting'),
                    'description': result.get('contentNoFormatting'),
                    'url': result.get('url'),
                    'domain': result['breadcrumbUrl'].get('host')
                }
                # TODO: Store other potentially useful values
                # try:
                #     serp['imgUrl'] = result.get('richSnippet')['cseImage']['src']
                # except KeyError:
                #     continue
                sql = "INSERT INTO search_result (title, description, url) VALUES (%s, %s, %s)"
                db.cur.execute(sql, (serp['title'], serp['description'], serp['url']))
                db.conn.commit()


