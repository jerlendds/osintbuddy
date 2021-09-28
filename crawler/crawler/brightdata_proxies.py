import os
from typing import Optional
# https://brightdata.com/cp/api_example?example=simple
# https://brightdata.com/cp/zones?example=simple


COUNTRY_CODE = "ca"
CUSTOMER_ID = os.environ.get("BRIGHTDATA_CUSTOMER_ID", False)
PROXY_ZONE = "cse_zone"

proxy_params = f"lum-customer-{CUSTOMER_ID}-zone-{PROXY_ZONE}-country-{COUNTRY_CODE}"

PROXY_STRING = "zproxy.lum-superproxy.io:22225:" + proxy_params


def parse_proxies(proxy_file: str, is_brightdata_provider: bool = CUSTOMER_ID):
    """
    :proxy_file: Expects text file where each line contains an http(s) url, append one new line to the end of file
    :is_brightdata_provider: If true expects path to downloaded brightdata proxy list, visit
    https://brightdata.com/cp/zones/ENTER_YOUR_ZONE/edit?example=simple and click 'Download IPs list'
                            and save to somewhere in the top level crawler directory (! NOTE: base crawler folder is
                            named spiderman in the crawler.Dockerfile)
    """
    proxy_by_line_text_file = open(proxy_file, 'r')
    proxies = []

    if is_brightdata_provider:
        for proxy in proxy_by_line_text_file:
            proxy_auth = proxy.split(':')
            proxy = {
                        "proxy": proxy_auth[0] + ':' + proxy_auth[1],
                        "user": proxy_params + ':' + proxy_auth[-1][:-1]
                    }
            proxies.append(proxy)
    else:
        for proxy in proxy_by_line_text_file:
            proxies.append(proxy)
    return proxies


class ProxyGenerator(object):
    def __init__(self, is_brightdata_provider: Optional[bool] = False, proxy_file: str = '/spiderman/crawler/ips-cse_zone.txt'):
        self.proxies = parse_proxies(proxy_file=proxy_file, is_brightdata_provider=True)
        self.is_brightdata_provider = is_brightdata_provider

    def __iter__(self):
        if self.is_brightdata_provider:
            for proxy in self.proxies:
                yield "https://" + proxy.get('user') + '@' + proxy.get('proxy')
        else:
            for proxy in self.proxies:
                yield proxy

    def __next__(self):
        return self.proxies


def get_proxies():
    proxy_list = []
    for p in ProxyGenerator(is_brightdata_provider=True):
        proxy_list.append(p)
    return proxy_list


if __name__ == "__main__":
    for p in ProxyGenerator():
        print(p)


