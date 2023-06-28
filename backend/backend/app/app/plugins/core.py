import json
import re
import socket

import httpx
from urllib.parse import urlparse
import dns.resolver
from selenium.webdriver.common.by import By
import osintbuddy as ob
from osintbuddy.elements import TextInput, Text, Title, Empty, CopyText
from osintbuddy.errors import OBPluginError, NodeMissingValueError
from osintbuddy.utils import to_camel_case


class WhoisPlugin(ob.Plugin):
    label = "WHOIS"
    name = "WHOIS"
    show_label = False
    color = "#F47C00"
    node = [
        CopyText(label="Raw whois", icon="world"),
    ]


class GoogleSearchPlugin(ob.Plugin):
    label = "Google Search"
    name = "Google search"
    color = "#3D78D9"
    node = [
        TextInput(label="Query", icon="search"),
        TextInput(label="Pages", icon="123", value="3"),
    ]

    @ob.transform(label="To results")
    async def transform_to_google_results(self, node, **kwargs):
        # print("@todo refactor transform node API: ", node)
        print('NODE', node)
        query = node["data"][0]
        pages = node["data"][1]
        results = []
        for result in await self.search_google(query, pages):
            blueprint = GoogleResult.blueprint(
                result={
                    "title": result.get("title"),
                    "subtitle": result.get("breadcrumb"),
                    "text": result.get("description"),
                },
                url=result.get("url"),
            )
            results.append(blueprint)
        return results

    def _parse_google_data(self, results) -> dict:
        stats = results.get("stats")
        related_searches = []
        result_stats = []
        if stats is not None:
            for stat in stats:
                if res := stat.get("result"):
                    result_stats = result_stats + res
                if related := stat.get("related"):
                    related_searches = related_searches + related
        output = []
        for key in list(results.keys()):
            if key is not None and key != "stats" and key != "questions":
                if results.get(key):
                    for result in results.get(key):
                        search_result = {
                            "index": result.get("index"),
                            "title": result.get("title"),
                            "description": result.get("description"),
                            "url": result.get("link"),
                            "breadcrumb": result.get("breadcrumb"),
                            "question": result.get("question"),
                            "result_type": key,
                        }
                        output.append(search_result)
        return {
            "stats": result_stats,
            "related": related_searches,
            "results": output,
        }

    async def search_google(self, query, pages):
        if not query:
            raise NodeMissingValueError("Query is a required field")
        try:
            async with httpx.AsyncClient() as client:
                google_resp = await client.get(
                    f'http://microservice:1323/google?query={query}&pages={pages}',
                    timeout=None
                )
                google_results = google_resp.json()
        except OBPluginError:
            raise OBPluginError((
                "There was an error crawling Google. Please try again."
                "If you keep encountering this error please open an issue on Github."
            ))

        results = self._parse_google_data(google_results)["results"]
        return results


class GoogleCacheResult(ob.Plugin):
    label = "Cache Result"
    show_label = False
    name = "Cache result"
    color = "#145070"
    node = [
        Title(label="result", title="Some title"),
        [
            CopyText(label="URL"),
        ],
    ]

    @ob.transform(label="To website", icon="world-www")
    async def transform_to_website(self, node, **kwargs):
        return WebsitePlugin.blueprint(domain=urlparse(node["data"][3]).netloc)


class GoogleCacheSearchPlugin(ob.Plugin):
    label = "Cache Search"
    name = "Google cache search"
    color = "#145070"
    node = [
        TextInput(label="Query", icon="search"),
        TextInput(label="Pages", icon="123", default="3"),
    ]

    @ob.transform(label="To cache results")
    async def transform_to_google_cache_results(self, node, **kwargs):
        
        
        query = node["data"][0]
        pages = node["data"][1]
        return await self.search_google_cache(query, pages)

    async def search_google_cache(self, query, pages):
        cache_results = []
        if not query:
            raise NodeMissingValueError("Query is a required field")
        try:
            async with httpx.AsyncClient() as client:
                google_resp = await client.get(
                    f'http://microservice:1323/google-cache?query={query}&pages={pages}',
                    timeout=None
                )
                cache_results = google_resp.json()
        except OBPluginError:
            raise OBPluginError(
                "We ran into an error crawling googles cache. Please try again."
            )
        results = []
        for result in self._parse_cache_results(
            cache_results
        ).get("results"):
            blueprint = GoogleCacheResult.blueprint(
                result={
                    "title": result.get("title"),
                    "text": result.get("description"),
                    "subtitle": result.get("breadcrumb"),
                },
                url=result.get("url"),
            )
            results.append(blueprint)
        return results

    def _parse_cache_results(self, cache_results):
        stats = cache_results.get("stats")
        related_searches = []
        result_stats = []
        if stats is not None:
            for stat in stats:
                if res := stat.get("result"):
                    result_stats = result_stats + res
                if related := stat.get("related"):
                    related_searches = related_searches + related

        results = []
        for key in cache_results.keys():
            if key is not None and key != "stats" and key != "questions":
                if cache_results.get(key):
                    for result in cache_results.get(key):
                        search_result = {
                            "index": result.get("index"),
                            "title": result.get("title"),
                            "description": result.get("description"),
                            "url": result.get("link"),
                            "breadcrumb": result.get("breadcrumb"),
                            "result_type": key,
                        }
                        results.append(search_result)
        return {
            "related": related_searches,
            "stats": result_stats,
            "results": results,
        }


class DnsPlugin(ob.Plugin):
    label = "DNS"
    name = "DNS"
    color = ""
    show_label = False
    icon = "server-2"
    node = [Title(label="record")]

    _items = [
        "NS",
        "A",
        "AAAA",
        "CNAME",
        "MX",
        "SOA",
        "TXT",
        "PTR",
        "SRV",
        "CERT",
        "DCHID",
        "DNAME",
    ]

    @classmethod
    def data_template(cls):
        return {k: None for k in cls._items}

    @staticmethod
    def record(key, data):
        _data = json.dumps(data).strip("'\" .")
        match key:
            case "MX":
                matches = re.findall(r"\d+ (.*)", _data)
                _data = matches[0] if len(matches) else _data
            case "TXT":
                _data = _data.strip('\\"')

        return {
            "title": "",
            "subtitle": f"{key} Record",
            "text": _data,
            "data": [_data],
        }

    @ob.transform(label="Extract IP", icon="microscope")
    async def transform_extract_ip(self, node, **kwargs) -> list:
        data = node["data"][2]
        ip_regexp = re.compile("\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}")
        results = []
        for ip in ip_regexp.findall(data):
            blueprint = IPAddressPlugin.blueprint(ip_address=ip)
            results.append(blueprint)
        return results


class GoogleResult(ob.Plugin):
    label = "Google Result"
    show_label = False
    name = "Google result"
    color = "#308e49"
    node = [Title(label="result"), CopyText(label="url")]

    @ob.transform(label="To website", icon="world")
    async def transform_to_website(self, node, **kwargs):
        blueprint = WebsitePlugin.blueprint(
            domain=urlparse(node["data"][3]).netloc
        )
        return blueprint


class WebsitePlugin(ob.Plugin):
    label = "Website"
    name = "Website"
    color = "#1D1DB8"
    icon = "world-www"
    node = [
        TextInput(label="Domain", icon="world-www"),
    ]

    @ob.transform(label="To IP", icon="building-broadcast-tower")
    async def transform_to_ip(self, node, **kwargs):
        blueprint = IPAddressPlugin.blueprint(
            ip_address=socket.gethostbyname(node["data"][0])
        )
        return blueprint

    @ob.transform(label="To google", icon="world")
    async def transform_to_google(self, node, **kwargs):
        # @todo
        domain = node["data"][0]
        query = f"{domain}"
        results = []
        for result in await GoogleSearchPlugin().search_google(
            query=query, pages="3"
        ):
            blueprint = GoogleResult.blueprint(
                result={
                    "title": result.get("title"),
                    "subtitle": result.get("breadcrumb"),
                    "text": result.get("description"),
                },
                url=result.get("url"),
            )
            results.append(blueprint)
        return results

    @ob.transform(label="To WHOIS", icon="world")
    async def transform_to_whois(self, node, **kwargs):
        domain = node["data"][0]
        if len(domain.split(".")) > 2:
            domain = domain.split(".")
            domain = domain[len(domain) - 2] + "." + domain[len(domain) - 1]

        with kwargs["get_driver"]() as driver:
            driver.get(f"https://www.whois.com/whois/{domain}")
            raw_whois = None
            try:
                raw_whois = driver.find_element(
                    by=By.TAG_NAME, value="pre"
                ).text
            except Exception as e:
                print(e)
                raise OBPluginError(
                    "Captcha encountered, please try again later."
                )
            return WhoisPlugin.blueprint(
                raw_whois="\n".join(self._parse_whois(raw_whois))
            )

    @ob.transform(label="To DNS", icon="world")
    async def transform_to_dns(self, node, **kwargs):
        # @todo
        blueprint = WebsitePlugin.blueprint()
        data = DnsPlugin.data_template()

        if len(node["data"]) == 0:
            raise NodeMissingValueError(
                "A website is required to process dns records"
            )

        website = node["data"][0]
        website_parsed = urlparse(website)
        if website_parsed.scheme:
            domain = website_parsed.netloc
        else:
            domain = urlparse(f"https://{website}").netloc

        for key in data.keys():
            try:
                resolved = dns.resolver.resolve(domain, key)
                data[key] = [str(answer) for answer in resolved]
            except Exception:
                pass
        results = []
        data_filled = dict((k, v) for k, v in data.items() if v is not None)
        for key, value in data_filled.items():
            for entry in value:
                blueprint = DnsPlugin.blueprint(
                    record=DnsPlugin.record(key, entry)
                )
                results.append(blueprint)
        return results

    # @ob.transform(label='To subdomains', icon='world')
    # async def transform_to_subdomains(self, node, **kwargs):
    #     # @todo
    #     return WebsitePlugin.blueprint(
    #         domain=urlparse(node['data'][3]).netloc
    #     )

    # @ob.transform(label='To emails', icon='world')
    # async def transform_to_emails(self, node, **kwargs):
    #     # @todo
    #     blueprint = WebsitePlugin.blueprint()
    #     website = node['data'][3]
    #     blueprint['elements'][0]['value'] = urlparse(website).netloc
    #     return blueprint
    # @ob.transform(label='To urlscan.io', icon='world')
    # async def transform_to_urlscanio(self, node, **kwargs):
    #     # @todo
    #     blueprint = WebsitePlugin.blueprint()
    #     domain = node['data'][0]
    #     if domain:
    #         domain = domain.replace('https://', '')
    #         domain = domain.replace('http://', '')
    #         params = {
    #             'q': quote(domain),
    #         }
    #         res = requests.get('https://urlscan.io/api/v1/search/', params=params)
    #     return blueprint

    @staticmethod
    def _parse_whois(whois_data):
        data = []
        for line in whois_data.split("\n"):
            if "DNSSEC" in line:
                data.append(line)
                break
            data.append(line)
        return data


class SubdomainPlugin(ob.Plugin):
    label = "Subdomain"
    name = "Subdomain"
    show_label = False
    color = "#FFCC33"
    node = [
        TextInput(label="Subdomain", icon="world"),
    ]


class IPGeolocationPlugin(ob.Plugin):
    label = "IP Geo"
    show_label = False

    name = "IP geolocation (ipinfo.io)"
    color = "#FFCC33"
    node = [
        [
            Title(label="geolocation-data", title="IP Geolocation"),
            Title(label="summary-data", title="Summary"),
        ],
        [
            Text(label="City", icon="map-pin"),
            Text(label="ASN", icon="access-point"),
        ],
        [
            Text(label="State", icon="map-pin"),
            Text(label="Hostname", icon="access-point"),
        ],
        [
            Text(label="Country", icon="map-pin"),
            Text(label="Range", icon="access-point"),
        ],
        [
            Text(label="Postal", icon="map-pin"),
            Text(label="Company", icon="trademark"),
        ],
        [
            Text(label="Timezone", icon="clock"),
            Text(label="Hosted domains", icon="access-point"),
        ],
        [
            Text(label="Coordinates", icon="map-pin"),
            Text(label="Privacy", icon="network"),
        ],
        [
            Empty(),
            Text(label="Anycast", icon="network"),
        ],
        [
            Empty(),
            Text(label="ASN type", icon="access-point"),
        ],
        [
            Empty(),
            Text(label="Abuse Contact", icon="map-pin"),
        ],
    ]
    style = {"gridTemplateColumns": "repeat(2, minmax(0, 1fr))"}


class IPAddressPlugin(ob.Plugin):
    label = "IP"
    name = "IP address"
    color = "#F47C00"
    node = [TextInput(label="IP Address", icon="map-pin")]

    @ob.transform(label="To website", icon="world", prompt="""""")
    async def transform_to_website(self, node, **kwargs):
        try:
            resolved = socket.gethostbyaddr(node["data"][0])
            if len(resolved) >= 1:
                blueprint = WebsitePlugin.blueprint(domain=resolved[0])
                return blueprint
            else:
                raise OBPluginError("No results found")
        except (socket.gaierror, socket.herror):
            raise OBPluginError("We ran into a socket error. Please try again")

    # @ob.transform(label='To traceroute', icon='crosshair')
    # async def transform_todo(self, node, **kwargs):
    #     blueprint = IPGeolocationPlugin.blueprint()
    #     return blueprint
    @ob.transform(label="To subdomains", icon="world")
    async def transform_to_subdomains(self, node, **kwargs):
        nodes = []
        params = {
            "q": node["data"][0],
        }
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    'https://api.hackertarget.com/reverseiplookup',
                    params=params,
                    timeout=None
                )
                data = response.content.decode("utf8").split("\n")
        except Exception as e:
            raise OBPluginError(e)
        for subdomain in data:
            blueprint = SubdomainPlugin.blueprint(subdomain=subdomain)
            nodes.append(blueprint)
        return nodes

    @ob.transform(label="To geolocation", icon="map-pin")
    async def transform_to_geolocation(self, node, **kwargs):
        summary_rows = [
            "ASN",
            "Hostname",
            "Range",
            "Company",
            "Hosted domains",
            "Privacy",
            "Anycast",
            "ASN type",
            "Abuse contact",
        ]  # noqa
        geo_rows = [
            "City",
            "State",
            "Country",
            "Postal",
            "Timezone",
            "Coordinates",
        ]  # noqa
        if len(node["data"]) == 0:
            raise OBPluginError(
                "IP Address is a required field for this transform"
            )

        geolocation = {}
        summary = {}
        with kwargs["get_driver"]() as driver:
            driver.get(f'https://ipinfo.io/{node["data"][0]}')
            for row in summary_rows:
                summary[to_camel_case(row)] = driver.find_element(
                    by=By.XPATH, value=self.get_summary_xpath(row)
                ).text
            for row in geo_rows:
                geolocation[to_camel_case(row)] = driver.find_element(
                    by=By.XPATH, value=self.get_geo_xpath(row)
                ).text
        blueprint = IPGeolocationPlugin.blueprint(
            city=geolocation.get("city"),
            state=geolocation.get("state"),
            country=geolocation.get("country"),
            postal=geolocation.get("postal"),
            timezone=geolocation.get("timezone"),
            coordinates=geolocation.get("coordinates"),
            asn=summary.get("asn"),
            hostname=summary.get("hostname"),
            range=summary.get("range"),
            company=summary.get("company"),
            hosted_domains=summary.get("hostedDomains"),
            privacy=summary.get("privacy"),
            anycast=summary.get("anycast"),
            asn_type=summary.get("asnType"),
            abuse_contact=summary.get("abuseContact"),
        )
        return blueprint

    @staticmethod
    def get_summary_xpath(value: str):
        return (
            f"//td//span[contains(text(),'{value}')]"
            "/ancestor::td/following-sibling::td"
        )

    @staticmethod
    def get_geo_xpath(value: str):
        return f"//td[contains(text(),'{value}')]/following-sibling::td"
