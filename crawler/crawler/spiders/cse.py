#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os
import re
import json
import random
from typing import Optional
from collections import OrderedDict
from urllib import parse as urlparse

from .cse_links_dump import links
from ..brightdata_proxies import get_proxies

import scrapy

user_agent_setting = os.environ.get('CRAWLER_USER_AGENT', 'unidentified osintbuddy user')
brightdata_proxy_id = os.environ.get('BRIGHTDATA_CUSTOMER_ID', False)


class CseSpider(scrapy.Spider):
    """
    Google Custom Search engine spider,
    first request fetches URL params required to create CSE results API url, second request hits API
    """
    name = "cse"
    allowed_domains = ["cse.google.com", "cse.google.co.uk"]

    custom_settings = dict()
    custom_settings['ITEM_PIPELINES'] = {'crawler.cse_pipeline.CsePipeline':  400}
    custom_settings['DOWNLOADER_MIDDLEWARES'] = {'scrapy.downloadermiddlewares.httpcompression.HttpCompressionMiddleware': 810}  # noqa
    custom_settings['BOT_NAME'] = 'CSE-Buddy'
    # CSEs by default have no robots.txt || Last checked September 16, 2021
    custom_settings['ROBOTSTXT_OBEY'] = False
    custom_settings['USER_AGENT'] = f'{user_agent_setting} -- https://github.com/jerlendds/osintbuddy'
    #
    if brightdata_proxy_id:
        custom_settings['ROTATING_PROXY_LIST'] = get_proxies()
        custom_settings['DOWNLOADER_MIDDLEWARES']['rotating_proxies.middlewares.RotatingProxyMiddleware'] = 610
        custom_settings['DOWNLOADER_MIDDLEWARES']['rotating_proxies.middlewares.BanDetectionMiddleware'] = 620
        custom_settings['BOT_NAME'] = 'Proxy-CSE-Buddy'

    start_urls = links

    def __init__(self, query: str, search_id: int, user_id: int, **kwargs):  # noqa
        self.search_query = query
        self.search_id = search_id
        self.user_id = user_id

    def start_requests(self):
        for url in self.start_urls:
            yield scrapy.Request(url=url, callback=self.parse, meta={
                'base_url': url})

    def parse(self, response):  # noqa
        base_url = response.meta.get('base_url').split('//')[1].split('/')[0]
        cse_id_url_param = response.meta.get('base_url').split('=')[1]
        url = "https://" + base_url + "/cse.js?ie=UTF-8&hpg=1&cx=" + cse_id_url_param
        yield scrapy.Request(url=url, callback=self.parse_cse_js_source)

    def parse_google_api(self, response):
        # Parses serps dict out of google response
        callback_len = len(str(response.meta.get('callback_value')))
        serps_data = response.body.decode('utf-8')[30 + callback_len:-2]
        serps = json.loads(serps_data)
        serps['search_id'] = self.search_id
        yield serps

    def parse_cse_js_source(self, response):
        re_cx = re.compile(r'"cx":\s(.*)(?![:\]][A-z\d])')
        re_token = re.compile(r'"cse_token":\s(.*)"')
        re_exp = re.compile('"exp":\s(.*)[:\]].+')
        re_cse_lib_version = re.compile('"cselibVersion":\s(.*)"+')

        cx = re_cx.search(response.body.decode("utf-8"))[1][1:][:-2]
        cse_token = re_token.search(response.body.decode("utf-8"))[1][1:]
        exp = re_exp.search(response.body.decode("utf-8"))[1][2:].split('"')
        exp = exp[0] + "," + exp[2]
        cse_lib_version = re_cse_lib_version.search(response.body.decode("utf-8"))[1][1:]
        cb_value = random.randint(1, 10000)
        callback = "google.search.cse.api" + str(cb_value)

        g_api_params = OrderedDict()

        g_api_params["rsz"] = "filtered_cse"
        g_api_params["num"] = "100"
        g_api_params["hl"] = "en"
        g_api_params["source"] = "gcsc"
        g_api_params["gss"] = ".com"
        g_api_params["cselibv"] = cse_lib_version
        g_api_params["cx"] = cx
        g_api_params["q"] = self.search_query
        g_api_params["safe"] = "off"
        g_api_params["cse_tok"] = cse_token
        g_api_params["sort"] = ""
        g_api_params["exp"] = exp
        g_api_params["oq"] = self.search_query
        g_api_params["cseclient"] = "hosted-page-client"
        g_api_params["callback"] = callback
        g_api_url = "https://cse.google.com/cse/element/v1?" + urlparse.urlencode(g_api_params)

        print('\033[93mGoogle CSE API URL: ' + g_api_url + '\033[0m')

        yield scrapy.Request(url=g_api_url, callback=self.parse_google_api, meta={
                'callback_value': cb_value,
            })
