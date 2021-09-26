#!/usr/bin/env python
# -*- coding: utf-8 -*-
from .database import db
# from scrapy.exceptions import DropItem


class CsePipeline:
    def open_spider(self, spider):
        pass

    def close_spider(self, spider):
        pass

    def process_item(self, item, spider):
        search_id = item.get('search_id')

        results = item.get('results')
        if results and len(results) > 0:
            for result in results:
                # serp = {
                #     'title': result.get('titleNoFormatting'),
                #     'description': result.get('contentNoFormatting'),
                #     'url': result.get('url'),
                #     'domain': result['breadcrumbUrl'].get('host')
                # }

                sql = "INSERT INTO search_result (title, description, url, search_id) VALUES (%s, %s, %s, %s)"
                db.cur.execute(sql, (result.get('titleNoFormatting'),
                                     result.get('contentNoFormatting'),
                                     result.get('url'),
                                     search_id))
                db.conn.commit()


