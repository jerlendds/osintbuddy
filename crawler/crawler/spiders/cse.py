#!/usr/bin/env python
# -*- coding: utf-8 -*-
import re
import random
from collections import OrderedDict
from urllib import parse as urlparse

import scrapy


search_input_xpath = '//*[@id="gsc-i-id1"]'


class CseSpider(scrapy.Spider):
    name = "cse"
    allowed_domains = ["cse.google.com", "cse.google.co.uk"]
    search_query = "Albert"

    start_urls = [
        "https://cse.google.com/cse/publicurl?cx=003463032493552175486:ojqidjsvi5y",
        "http://cse.google.com/cse/publicurl?cx=003265255082301896483:sq5n7qoyfh8",
        "http://cse.google.co.uk/cse/publicurl?cx=008631174082973208937:umykkouecka",
        "https://cse.google.com/cse/publicurl?cx=001394533911082033616:tm5y1wqwmme",
        "https://cse.google.com/cse/publicurl?cx=001394533911082033616:eijeouh5qpa",
        "https://cse.google.com/cse/publicurl?cx=001394533911082033616:inhash9yhdk",
        "https://cse.google.com/cse/publicurl?cx=001394533911082033616:vjd-_np8_li",
        "https://cse.google.com/cse/publicurl?cx=001394533911082033616:svzu2yy2jqg",
        "https://cse.google.com/cse/publicurl?cx=001394533911082033616:3rmgu_htqw4",
        "https://cse.google.com/cse/publicurl?cx=001394533911082033616:hb6fz4kptg8",
    ]

    def start_requests(self):
        for url in self.start_urls:
            yield scrapy.Request(url=url, callback=self.parse, meta={
                'base_url': url,

            })

    def parse(self, response):  # noqa
        base_url = response.meta.get('base_url').split('//')[1].split('/')[0]
        cse_id = response.meta.get('base_url').split(':')[-1]

        init_g_scripts = response.css('script::text').getall()

        for script in init_g_scripts:
            cse_js_url_pattern = r"/([^';}]*)(?<![A-z=\s{()])(?![A-z])"
            p = re.compile(cse_js_url_pattern)
            cse_js_url = p.search(script).group(1)

            encoded_url = "https://" + base_url + "/" + cse_js_url + ":" + cse_id
            url = bytes(encoded_url, "utf-8").decode("unicode_escape")

            yield scrapy.Request(url=url, callback=self.parse_cse_js_source)

    def parse_google_api(self, response):
        print('\n\n\n\n')
        print("final result!!!!!")
        print(response.body.decode('utf-8'))
        print('\n\n\n\n')

    def parse_cse_js_source(self, response):
        re_cx = re.compile(r'"cx":\s(.*)(?![:\]][A-z\d])')
        re_token = re.compile(r'"cse_token":\s(.*)"')
        re_exp = re.compile('"exp":\s(.*)[:\]].+')
        re_cse_lib_version = re.compile('"cselibVersion":\s(.*)"+')
        # re_usqp = re.compile('"usqp":\s(.*)"+')

        cx = re_cx.search(response.body.decode("utf-8"))[1][1:][:-2]
        cse_token = re_token.search(response.body.decode("utf-8"))[1][1:]
        exp = re_exp.search(response.body.decode("utf-8"))[1][2:].split('"')
        exp = exp[0] + "," + exp[2]
        cse_lib_version = re_cse_lib_version.search(response.body.decode("utf-8"))[1][1:]
        # usqp = bytes(re_usqp.search(response.body.decode("utf-8"))[1][1:], "utf-8").decode("unicode_escape")
        callback = "google.search.cse.api" + str(random.randint(1, 10000))

        query = "Albert"

        g_api_params = OrderedDict()

        g_api_params["rsz"] = "filtered_cse"
        g_api_params["num"] = "100"
        g_api_params["hl"] = "en"
        g_api_params["source"] = "gcsc"
        g_api_params["gss"] = ".com"
        g_api_params["cselibv"] = cse_lib_version
        g_api_params["cx"] = cx
        g_api_params["q"] = query
        g_api_params["safe"] = "off"
        g_api_params["cse_tok"] = cse_token
        g_api_params["sort"] = ""
        g_api_params["exp"] = exp
        g_api_params["oq"] = query
        g_api_params["cseclient"] = "hosted-page-client"
        g_api_params["callback"] = callback

        g_api_url = "https://cse.google.com/cse/element/v1?" + urlparse.urlencode(g_api_params)

        yield scrapy.Request(url=g_api_url, callback=self.parse_google_api)
