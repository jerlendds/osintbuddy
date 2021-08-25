#!/usr/bin/env python
# -*- coding: utf-8 -*-
import re
import random

import scrapy

search_input_xpath = '//*[@id="gsc-i-id1"]'


class CseSpider(scrapy.Spider):
    name = "cse"
    allowed_domains = ["cse.google.com", "cse.google.co.uk"]
    search_query = "Albert"

    start_urls = [
        "https://cse.google.com/cse/publicurl?cx=003463032493552175486:ojqidjsvi5y",
        "http://cse.google.com/cse/publicurl?cx=003265255082301896483:sq5n7qoyfh8",
        "http://cse.google.co.uk/cse/publicurl?cx=008631174082973208937:umykkouecka"
    ]

    def start_requests(self):
        for url in self.start_urls:
            yield scrapy.Request(url=url, callback=self.parse, meta={
                'base_url': url,

            })

    def parse(self, response):  # noqa
        # extract domain from base url to construct next request
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
        print(response.body.decode('utf-8'))

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
        g_api_url = "https://cse.google.com/cse/element/v1?" \
                    f"rsz=filtered_cse" \
                    f"&num=100" \
                    f"&hl=en" \
                    f"&source=gcsc" \
                    f"&gss=.com" \
                    f"&cselibv={cse_lib_version}" \
                    f"&cx={cx}" \
                    f"&q={query}" \
                    f"&safe=off" \
                    f"&cse_tok={cse_token}" \
                    f"&sort=" \
                    f"&exp={exp}" \
                    f"&oq={query}" \
                    f"&cseclient=hosted-page-client" \
                    f"&callback={callback}"

        print(g_api_url)

        yield scrapy.Request(url=g_api_url, callback=self.parse_google_api)
