import json
import socket
import requests
from urllib.parse import urlparse
import dns.resolver
from selenium.webdriver.common.by import By
from osintbuddy.plugins import OBPlugin, transform
from osintbuddy.node import TextInput, Text, Title, Empty, CopyText
from osintbuddy.errors import OBPluginError, NodeMissingValueError
from osintbuddy.utils import to_camel_case


class WhoisPlugin(OBPlugin):
    label = 'WHOIS'
    name = 'WHOIS'
    show_label = False
    color = '#F47C00'
    node = [
        TextInput(label='Raw whois', icon='world'),
    ]


class GoogleResult(OBPlugin):
    label = 'Google Result'
    show_label = False
    name = 'Google result'
    color = '#308e49'
    node = [
        Title(label='result'),
        CopyText(label='url')
    ]

    @transform(label='To website', icon='world')
    def transform_to_website(self, node, **kwargs):
        blueprint = WebsitePlugin.blueprint(
            domain=urlparse(node['data'][3]).netloc
        )
        return blueprint


class GoogleSearchPlugin(OBPlugin):
    label = 'Google Search'
    name = 'Google search'
    color = '#3D78D9'
    node = [
        TextInput(label='Query', icon='search'),
        TextInput(label='Pages', icon='123', value='3'),
    ]

    @transform(label='To results')
    def transform_to_google_results(self, node, **kwargs):
        query = node['data'][0]
        pages = node['data'][1]
        results = []
        for result in self.search_google(query, pages):
            blueprint = GoogleResult.blueprint(
                result={
                    'title': result.get('title'),
                    'subtitle': result.get('breadcrumb'),
                    'text': result.get('description'),
                },
                url=result.get('url')
            )
            results.append(blueprint)
        return results

    def _parse_google_data(self, results) -> dict:
        stats = results.get('stats')
        related_searches = []
        result_stats = []
        if stats is not None:
            for stat in stats:
                if res := stat.get('result'):
                    result_stats = result_stats + res
                if related := stat.get('related'):
                    related_searches = related_searches + related
        output = []
        for key in list(results.keys()):
            if key is not None and key != 'stats' and key != 'questions':
                if results.get(key):
                    for result in results.get(key):
                        search_result = {
                            'index': result.get('index'),
                            'title': result.get('title'),
                            'description': result.get('description'),
                            'url': result.get('link'),
                            'breadcrumb': result.get('breadcrumb'),
                            'question': result.get('question'),
                            'result_type': key,
                        }
                        output.append(search_result)
        return {
            'stats': result_stats,
            'related': related_searches,
            'results': output
        }

    def search_google(self, query, pages):
        if not query:
            raise NodeMissingValueError("Query is a required field")
        try:
            google_resp = requests.get((
                'http://microservice:1323/google?'
                f'query={query}&pages={pages}'
            ))
            google_results = google_resp.json()
        except OBPluginError:
            raise OBPluginError((
                "There was an error crawling Google. Please try again."
                "If you keep encountering this error please open an issue on Github."
            ))

        results = self._parse_google_data(google_results)['results']
        return results


class GoogleCacheResult(OBPlugin):
    label = 'Cache Result'
    show_label = False
    name = 'Cache result'
    color = '#145070'
    node = [
        Title(label='result', title='Some title'),
        [
            CopyText(label='URL'),
        ]
    ]

    @transform(label='To website', icon='world-www')
    def transform_to_website(self, node, **kwargs):
        return WebsitePlugin.blueprint(
            domain=urlparse(node['data'][3]).netloc
        )


class GoogleCacheSearchPlugin(OBPlugin):
    label = 'Cache Search'
    name = 'Google cache search'
    color = '#145070'
    node = [
        TextInput(label='Query', icon='search'),
        TextInput(label='Pages', icon='123', default='3')
    ]

    @transform(label='To cache results')
    def transform_to_google_cache_results(self, node, **kwargs):
        query = node['data'][0]
        pages = node['data'][1]
        return self.search_google_cache(query, pages)

    def search_google_cache(self, query, pages):
        if not query:
            raise NodeMissingValueError("Query is a required field")
        cache_results = None
        try:
            google_resp = requests.get((
                'http://microservice:1323/google-cache?'
                f'query={query}&pages={pages}'
            ))
            cache_results = google_resp.json()
        except OBPluginError:
            raise OBPluginError("We ran into an error crawling googles cache. Please try again.")
        results = []
        for result in self._parse_cache_results(cache_results).get('results'):
            blueprint = GoogleCacheResult.blueprint(
                result={
                    'title': result.get('title'),
                    'text': result.get('description'),
                    'subtitle': result.get('breadcrumb')
                },
                url=result.get('url')
            )
            results.append(blueprint)
        return results

    def _parse_cache_results(self, cache_results):
        stats = cache_results.get('stats')
        related_searches = []
        result_stats = []
        if stats is not None:
            for stat in stats:
                if res := stat.get('result'):
                    result_stats = result_stats + res
                if related := stat.get('related'):
                    related_searches = related_searches + related

        results = []
        for key in cache_results.keys():
            if key is not None and key != 'stats' and key != 'questions':
                if cache_results.get(key):
                    for result in cache_results.get(key):
                        search_result = {
                            'index': result.get('index'),
                            'title': result.get('title'),
                            'description': result.get('description'),
                            'url': result.get('link'),
                            'breadcrumb': result.get('breadcrumb'),
                            'result_type': key,
                        }
                        results.append(search_result)
        return {
            'related': related_searches,
            'stats': result_stats,
            'results': results
        }


class DnsPlugin(OBPlugin):
    label = 'DNS'
    name = 'DNS'
    color = ''
    icon = 'server-2'
    node = [
        Title(label='record')
    ]


class WebsitePlugin(OBPlugin):
    label = 'Website'
    name = 'Website'
    color = '#1D1DB8'
    icon = 'world-www'
    node = [
        TextInput(label='Domain', icon='world-www'),
    ]

    @transform(label='To IP', icon='building-broadcast-tower')
    def transform_to_ip(self, node, **kwargs):
        blueprint = IPAddressPlugin.blueprint(
            ip_address=socket.gethostbyname(node['data'][0])
        )
        return blueprint

    @transform(label='To WHOIS', icon='world')
    def transform_to_whois(self, node, **kwargs):
        domain = node['data'][0]
        blueprint = WhoisPlugin.blueprint()
        if len(domain.split('.')) > 2:
            domain = domain.split('.')
            domain = domain[len(domain) - 2] + '.' + domain[len(domain) - 1]

        with kwargs['get_driver']() as driver:
            driver.get(f'https://www.whois.com/whois/{domain}')
            raw_whois = None
            try:
                domain_info = driver.find_elements(
                    by=By.CSS_SELECTOR,
                    value='div.df-block:nth-child(2) > div'
                )
                raw_whois = driver.find_element(
                    by=By.TAG_NAME,
                    value='pre'
                ).text
            except Exception as e:
                print(e)
                raise OBPluginError('Captcha encountered, please try again later.')
            blueprint['elements'][0]['value'] = '\n'.join(self._parse_whois(raw_whois))
            return blueprint

    @transform(label='To DNS', icon='world')
    def transform_to_dns(self, node, **kwargs):
        # @todo
        blueprint = WebsitePlugin.blueprint()
        data = {
            "NS": None,
            "A": None,
            "AAAA": None,
            "CNAME": None,
            "MX": None,
            "SOA": None,
            "TXT": None,
            "PTR": None,
            "SRV": None,
            "CERT": None,
            "DCHID": None,
            "DNAME": None,
        }
        if len(node['data']) == 0:
            raise NodeMissingValueError("A website is required to process dns records")

        website = node['data'][0].split('.')
        domain = website[len(website) - 2] + '.' + website[len(website) - 1]
        for key in data.keys():
            try:
                resolved = dns.resolver.resolve(domain, key)
                data[key] = [str(answer) for answer in resolved]
            except Exception:
                pass
        results = []
        for key in data.keys():
            if data[key] is not None:
                blueprint = DnsPlugin.blueprint(
                    record={
                        'title': '',
                        'subtitle': f'{key} Record',
                        'text': json.dumps(data[key])
                    }
                )
                results.append(blueprint)
        return results

    # @transform(label='To subdomains', icon='world')
    # def transform_to_subdomains(self, node, **kwargs):
    #     # @todo
    #     return WebsitePlugin.blueprint(
    #         domain=urlparse(node['data'][3]).netloc
    #     )

    # @transform(label='To emails', icon='world')
    # def transform_to_emails(self, node, **kwargs):
    #     # @todo
    #     blueprint = WebsitePlugin.blueprint()
    #     website = node['data'][3]
    #     blueprint['elements'][0]['value'] = urlparse(website).netloc
    #     return blueprint

    @transform(label='To google', icon='world')
    def transform_to_google(self, node, **kwargs):
        # @todo
        domain = node['data'][0]
        query = f"{domain}"
        results = []
        for result in GoogleSearchPlugin().search_google(query=query, pages="3"):
            blueprint = GoogleResult.blueprint(
                result={
                    'title': result.get('title'),
                    'subtitle': result.get('breadcrumb'),
                    'text': result.get('description'),
                },
                url=result.get('url')
            )
            results.append(blueprint)
        return results

    # @transform(label='To urlscan.io', icon='world')
    # def transform_to_urlscanio(self, node, **kwargs):
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

    # @transform(label='To traceroute', icon='world')
    # def transform_to_traceroute(self, node, **kwargs):
    #     # @todo
    #     blueprint = WebsitePlugin.blueprint()
    #     website = node['data'][3]
    #     blueprint['elements'][0]['value'] = urlparse(website).netloc
    #     return blueprint

    def _parse_whois(self, whois_data):
        data = []
        for line in whois_data.split('\n'):
            if "DNSSEC" in line:
                data.append(line)
                break
            data.append(line)
        return data


class SubdomainPlugin(OBPlugin):
    label = 'Subdomain'
    name = 'Subdomain'
    color = '#FFCC33'
    node = [
        TextInput(label='Subdomain', icon='world'),
    ]


class IPGeolocationPlugin(OBPlugin):
    label = 'IP Geo'
    show_label = False

    name = 'IP geolocation (ipinfo.io)'
    color = '#FFCC33'
    node = [
        [
            Title(label='geolocation-data', title='IP Geolocation'),
            Title(label='summary-data', title='Summary'),
        ],
        [
            Text(label='City', icon='map-pin'),
            Text(label='ASN', icon='access-point'),
        ],
        [
            Text(label='State', icon='map-pin'),
            Text(label='Hostname', icon='access-point'),
        ],
        [
            Text(label='Country', icon='map-pin'),
            Text(label='Range', icon='access-point'),
        ],
        [
            Text(label='Postal', icon='map-pin'),
            Text(label='Company', icon='trademark'),
        ],
        [
            Text(label='Timezone', icon='clock'),
            Text(label='Hosted domains', icon='access-point'),
        ],
        [
            Text(label='Coordinates', icon='map-pin'),
            Text(label='Privacy', icon='network'),
        ],
        [
            Empty(),
            Text(label='Anycast', icon='network'),
        ],
        [
            Empty(),
            Text(label='ASN type', icon='access-point'),
        ],
        [
            Empty(),
            Text(label='Abuse Contact', icon='map-pin'),
        ]
    ]
    style = {
        'gridTemplateColumns': 'repeat(2, minmax(0, 1fr))'
    }


class IPAddressPlugin(OBPlugin):
    label = 'IP'
    name = 'IP address'
    color = '#F47C00'
    node = [
        TextInput(label='IP Address', icon='map-pin')
    ]

    @transform(label='To website', icon='world', prompt="""""")
    def transform_to_website(self, node, **kwargs):
        try:
            resolved = socket.gethostbyaddr(node['data'][0])
            if len(resolved) >= 1:
                blueprint = WebsitePlugin.blueprint(domain=resolved[0])
                return blueprint
            else:
                raise OBPluginError('No results found')
        except (socket.gaierror, socket.herror):
            raise OBPluginError('We ran into a socket error. Please try again')

    # @transform(label='To traceroute', icon='crosshair')
    # def transform_todo(self, node, **kwargs):
    #     blueprint = IPGeolocationPlugin.blueprint()
    #     return blueprint
    @transform(label='To subdomains', icon='world')
    def transform_to_subdomains(self, node, **kwargs):
        nodes = []
        params = {
            'q': node['data'][0],
        }
        try:
            response = requests.post(
                'https://api.hackertarget.com/reverseiplookup',
                params=params,
            )
            data = response.content.decode('utf8').split('\n')
            for subdomain in data:
                blueprint = SubdomainPlugin.blueprint(
                    subdomain=subdomain
                )
                nodes.append(blueprint)
            return nodes
        except Exception:
            return []

    @transform(label='To geolocation', icon='map-pin')
    def transform_to_geolocation(self, node, **kwargs):
        summary_rows = ['ASN', 'Hostname', 'Range', 'Company', 'Hosted domains', 'Privacy', 'Anycast', 'ASN type', 'Abuse contact']  # noqa
        geo_rows = ['City', 'State', 'Country', 'Postal', 'Timezone', 'Coordinates']  # noqa
        if len(node['data']) == 0:
            raise OBPluginError('IP Address is a required field for this transform')

        geolocation = {}
        summary = {}
        with kwargs['get_driver']() as driver:
            driver.get(f'https://ipinfo.io/{node["data"][0]}')
            for row in summary_rows:
                summary[
                    to_camel_case(row)
                ] = driver.find_element(
                    by=By.XPATH,
                    value=self.get_summary_xpath(row)
                ).text
            for row in geo_rows:
                geolocation[
                    to_camel_case(row)
                ] = driver.find_element(
                    by=By.XPATH,
                    value=self.get_geo_xpath(row)
                ).text
        blueprint = IPGeolocationPlugin.blueprint(
            city=geolocation.get('city'),
            state=geolocation.get('state'),
            country=geolocation.get('country'),
            postal=geolocation.get('postal'),
            timezone=geolocation.get('timezone'),
            coordinates=geolocation.get('coordinates'),
            asn=summary.get('asn'),
            hostname=summary.get('hostname'),
            range=summary.get('range'),
            company=summary.get('company'),
            hosted_domains=summary.get('hostedDomains'),
            privacy=summary.get('privacy'),
            anycast=summary.get('anycast'),
            asn_type=summary.get('asnType'),
            abuse_contact=summary.get('abuseContact')
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
