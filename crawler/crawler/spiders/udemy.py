#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os
from ..brightdata_proxies import get_proxies
import scrapy
import json

user_agent_setting = os.environ.get('CRAWLER_USER_AGENT', 'unidentified osintbuddy user')
brightdata_proxy_id = os.environ.get('BRIGHTDATA_CUSTOMER_ID', False)

proxies = get_proxies()
print(proxies, "<-Proxies over here")


class UdemySpider(scrapy.Spider):
    """
    Udemy meta course information
    First request fetches list of courses, second request extracts date created for each course
    """
    name = "udemy"

    custom_settings = dict()
    custom_settings['ITEM_PIPELINES'] = {'crawler.udemy_pipeline.UdemyPipeline':  400}
    custom_settings['DOWNLOADER_MIDDLEWARES'] = {'scrapy.downloadermiddlewares.httpcompression.HttpCompressionMiddleware': 810}  # noqa
    custom_settings['BOT_NAME'] = 'CSE-Buddy'
    custom_settings['ROBOTSTXT_OBEY'] = False
    custom_settings['USER_AGENT'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36'
    custom_settings['DEFAULT_REQUEST_HEADERS'] = {
                        "Host": "www.udemy.com",
                        "Accept": "application/json",
                        # inside the docker container this breaks the response
                        # but not on my main machine??
                        # "Accept-Encoding": 	"gzip, deflate, br",
                        "Accept-Language": "en-US,en;q=0.5",
                        "X-Requested-With": "XMLHttpRequest",
                        "X-Udemy-Cache-Marketplace-Country": "US",
                        "X-Udemy-Cache-Device": "desktop",
                        "X-Udemy-Cache-Version": "1",
                        "X-Udemy-Cache-Modern-Browser": "1",
                        'X-Udemy-Cache-Price-Country': "US",
                        "X-Udemy-Cache-Language": "en",
                        "X-Udemy-Cache-User": "",
                        "X-Udemy-Cache-Brand": "USen_US",
                        "X-Udemy-Cache-Logged-In": "0",
                        "Connection": "keep-alive",
                        "Referer": "https://www.udemy.com/courses/search/?src=ukw&q=python",
                        "Cookie": "ud_cache_marketplace_country=CA; csrftoken=kW4TdpT6RGMDrSRu5Q9e1KRt2kxV4pfTCId9QNvurEsaV27rGfDUwESyaNmrgZCH; ud_cache_device=desktop; ud_firstvisit=2021-10-01T23:36:13.712971+00:00:1mWS4c:kVLLAqa24aycjy6RrJhYMAqgBgk; ud_cache_version=1; ud_rule_vars=\"eJxtzEsOgjAUheGtkE4VculTupYmzaVcsJHYWAoTwt4l0ZlOT_7v7KxgnqjQ4Le4xJKylSr0qpPKCNKyU4S3IIPCQRDXmtNoQ0qPSMxWbHdsjHkpH-sHLOTO3TEOvK1bqKGtuLBC21Y0BvQNzAXAAjh2PasZT5rptdLyF_MKhJXGgmm4VNLwH1zSGu6-ZBzHGPyS1hzIb5gj9vP3LeUJnzE4drDjDXdaSAM=:1mWVzP:DaXIrlzzycd4PXFVVawAsUaWP8I\"; ud_cache_modern_browser=1; ud_cache_release=9f026f3b0a6ad5debca7; ud_cache_campaign_code=LEARNNEWSKILLS; ud_cache_price_country=CA; ud_cache_language=en; ud_cache_user=""; ud_cache_brand=CAen_US; ud_cache_logged_in=0; evi=\"3@4mUHD4a9SOOcSPTFdsdGWysTZrUvyJxeK8sMYNZYOOO5q14_LebVdoFSiP0-f2P3k5QBq5GN2lO9cQJD9X6KerbmAQs3R_48pqk2QqTXFHQlY7HT2gYhAHCK4_GriLRcx9nD5SAxtojAttRMzV5K7ugNMGpTWZdAdisB_zG7Re6JcGW6yNYSm6EbUee6V2CeC-iydwDs-chszS0Slmk0R1oTs0u7JlbCCBLqftobaZN0NL7Ef_NTOyMtIhoI0545HMmPW7CJ-lV1VO3jJlzuCW7GvSRLRTM2gEkq_Ftjfgwi5j2-Vlk60HJOlkcqlx6k3c-dtkvprfL6xZElRr3wh6_6wyKd3iIhkKupaoV3qbGca3I=\"; __udmy_2_v57r=45cb594573e6495ea8c4c5ad3e2662ef; OptanonConsent=isIABGlobal=false&datestamp=Fri+Oct+01+2021+21%3A46%3A47+GMT-0600+(Mountain+Daylight+Time)&version=6.10.0&hosts=&consentId=53a87bc4-4f13-4ef4-ab18-51c4ba48fbb4&interactionCount=1&landingPath=NotLandingPage&groups=C0001%3A1%2CC0003%3A1%2CC0005%3A1%2CC0002%3A1%2CC0004%3A1&AwaitingReconsent=false; __cfruid=cf1858c7a2f8c1fe3d80eeaa51b31d3b33918a6d-1633132951; query_session_identifier_id=JIecREcKQJOr8bEttj-9dA; last_searched_phrase=23eeeb4347bdd26bfc6b7ee9a3b755dd; seen=1; __cf_bm=vvaXdxz45NXnabObaDNmAo.4ve39KNt0oIW3CCeiKzs-1633146404-0-AReDriGiqNqCdZL8RH4dZS8vJ0HdJm2GPyRgYgYRryHMdijHJDltgGOZQDs/rHbBgbG6JaIEr8z0AzJI9efvW4Y=; eventing_session_id=n3HHA6QsTmWDhvx78nHDMw-1633148227311; dj_session_id=ncdevwh97b7ckpx02mzuhyao6v0xrduc; _pxhd=ay9r2boKqqezXmvUSL7iCSxdD16bHKa6N-qNKjR/pbnOZJjxkB-i7ndvw-SBqh2-lZ7X3-K9slpUuWQjqjwXAQ==:D0mP4U-ss5Ksj4SEiSzBdf9NWwa26MstL9jdx4SfcqYPyxBzunD/STMSrlM6MEUWoIXEj6bZ/c7qPA66NEyqJiT0/2FlOo4a0Cov4u1SMIg=; G_ENABLED_IDPS=google; EUCookieMessageShown=true; EUCookieMessageState=initial",
                        "Sec-Fetch-Dest": "empty",
                        "Sec-Fetch-Mode": "cors",
                        "Sec-Fetch-Site": "same-origin",
                        "TE": "trailers"
                    }

    custom_settings['ROTATING_PROXY_LOGSTATS_INTERVAL'] = 1

    custom_settings['ROTATING_PROXY_LIST'] = proxies
    custom_settings['DOWNLOADER_MIDDLEWARES']['rotating_proxies.middlewares.RotatingProxyMiddleware'] = 610
    custom_settings['DOWNLOADER_MIDDLEWARES']['rotating_proxies.middlewares.BanDetectionMiddleware'] = 620
    custom_settings['BOT_NAME'] = 'Proxy-CSE-Buddy'


    def __init__(self,  **kwargs):  # noqa
        self.search_query = "javascript"
        self.start_urls = self.links()

    def links(self):
        urls = []
        for page in range(0, 500):
            pagination_url = f"https://www.udemy.com/api-2.0/search-courses/" \
                             f"?&src=ukw&q={self.search_query}&p={page}&skip_price=true"
            if page == 1:
                pagination_url = f"https://www.udemy.com/api-2.0/search-courses/" \
                                 f"?&src=ukw&q={self.search_query}&skip_price=true"

            urls.append(pagination_url)
        return urls

    def start_requests(self):
        for url in self.start_urls:
            yield scrapy.Request(url=url, callback=self.parse, headers=self.custom_settings['DEFAULT_REQUEST_HEADERS'])

    def parse(self, response):  # noqa
        data = response.json()
        # data = response.json()
        print(json.dumps(data, indent=5))
        data['query'] = self.search_query
        yield data

x = {
    'count': 10000,
    'has_courses_for_org': True,
    'courses': [
        {'num_published_lectures': 73,
         'learn_url': '/course/compodoc-crea-documentacion-en-angular-ionic/learn/',
         'id': 1777518,
         'image_240x135': 'https://img-c.udemycdn.com/course/240x135/1777518_b681_6.jpg',
         'rating': 4.6925545,
         'is_paid': False,
         '_class': 'course',
         'badges': [],
         'predictive_score': 0.041203003,
         'objectives_summary': ['Crear documentación limpia y fácil de mantener en proyectos de Angular / Ionic', 'Crear la documentación con diferentes plantillas proporcionadas', 'Crear documentación aplicando estilos propios'],
         'instructional_level_simple': 'All Levels',
         'is_practice_test_course': False,
         'visible_instructors': [{'title': 'Anartz Mugika Ledo', 'display_name': 'Anartz Mugika Ledo'}],
         'image_100x100': 'https://img-c.udemycdn.com/course/100x100/1777518_b681_6.jpg',
         'image_125_H': 'https://img-c.udemycdn.com/course/125_H/1777518_b681_6.jpg',
         'content_info': '3 total hours',
         'num_subscribers': 14194,
         'image_480x270': 'https://img-c.udemycdn.com/course/480x270/1777518_b681_6.jpg',
         'badge_families': [],
         'badge_types': [],
         'relevancy_score': 630.43616,
         'url': '/course/compodoc-crea-documentacion-en-angular-ionic/',
         'image_304x171': 'https://img-c.udemycdn.com/course/304x171/1777518_b681_6.jpg',
         'headline': 'Crear documentación de calidad y MUY fácil de mantener con Compodoc para proyectos de Angular 2+ / Ionic 2+ / Typescript',
         'is_in_user_subscription': False,
         'num_reviews': 201,
         'tracking_id': 'FnzNe_3SQSaStonrmHhIaA',
         'title': 'Compodoc: Crea documentación en proyectos Angular/Ionic/TS'},
  ]}