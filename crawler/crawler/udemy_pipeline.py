#!/usr/bin/env python
# -*- coding: utf-8 -*-
from .database import db
import datetime
import json
import requests
# from scrapy.exceptions import DropItem

class UdemyPipeline:
    def open_spider(self, spider):
        pass

    def close_spider(self, spider):
        pass

    def process_item(self, item, spider):
        print("ITEM: ", item)
        search_query = item.get("query")
        try:
            for course in item.get('courses'):
                course_id = course.get("id")
                r = requests.get(f"https://www.udemy.com/api-2.0/courses/"
                                 f"{course_id}/?fields[course]=created")
                course['created'] = r.json().get('created')
                course['query'] = search_query
                udemy_course = {
                    "headline": course.get('headline'),
                    "course_id": course.get('id'),
                    "title": course.get('title'),
                    "url": course.get('url'),
                    "instructional_level": course.get('instructional_level_simple'),
                    "is_paid": course.get('is_paid'),
                    "num_published_lectures": course.get('num_published_lectures'),
                    "tracking_id": course.get('tracking_id'),
                    "num_subscribers": course.get('num_subscribers'),
                    "rating": course.get('rating'),
                    "num_reviews": course.get('num_reviews'),
                    "objectives_summary": str(course.get('objectives_summary')),
                    "learn_url": course.get('learn_url'),
                    "created": course.get('created'),
                    "query": course.get('query')
                }
                print(json.dumps(udemy_course, indent=5))
                sql = "INSERT INTO udemy_result (course_id, title, url, is_paid, tracking_id, headline, num_subscribers, rating, num_reviews, num_published_lectures, instructional_level, objectives_summary, learn_url, created, query) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
                db.cur.execute(sql, (course.get('id'),
                                     course.get('title'),
                                     course.get('url'),
                                     course.get('is_paid'),
                                     course.get('tracking_id'),
                                     course.get('headline'),
                                     course.get('num_subscribers'),
                                     course.get('rating'),
                                     course.get('num_reviews'),
                                     course.get('num_published_lectures'),
                                     course.get('instructional_level_simple'),
                                     str(course.get('objectives_summary')),
                                     course.get('learn_url'),
                                     datetime.datetime.strptime(course.get('created'), "%Y-%m-%dT%H:%M:%SZ"),
                                     course.get('query')
                                     ))
                db.conn.commit()
        except Exception as e:
            print(e)
        print(json.dumps(udemy_course, indent=5))


