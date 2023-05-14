import json
import urllib
import requests
from collections import defaultdict
from osintbuddy.plugins import OBPlugin, transform
from osintbuddy.node import TextInput, DropdownInput, Title, CopyText
from osintbuddy.errors import OBPluginError
from app.plugins.url import UrlPlugin

cse_link_options = json.load(open('app/plugins/cses.json'))


class CSESearchResultsPlugin(OBPlugin):
    label = 'CSE Result'
    name = 'CSE result'
    show_label = False
    color = '#058F63'
    node = [
        Title(label='result'),
        CopyText(label='URL'),
        CopyText(label='Cache URL')
    ]

    @transform(label='To URL', icon='link')
    def transform_to_url(self, node, **kwargs):
        return UrlPlugin.blueprint(url=node['data'][3])


class CSESearchPlugin(OBPlugin):
    label = 'CSE Search'
    name = 'CSE search'
    color = '#2C7237'
    node = [
        [
            TextInput(label='Query', icon='search'),
            TextInput(label='Pages', icon='123', default='1')
        ],
        DropdownInput(label='Categories', options=cse_link_options)
    ]

    @transform(label='To cse results', icon='search')
    def transform_to_cse_results(self, node, **kwargs):
        results = []
        
        if len(node['data']) != 3:
            raise OBPluginError("All fields are required. Please try again")
        query = node['data'][0]
        pages = node['data'][1]
        option = json.loads(node['data'][2])
        parsed_url = urllib.parse.urlparse(option['url'])
        cse_id = urllib.parse.parse_qs(parsed_url.query)['cx'][0]
        resp = defaultdict(None)
        try:
            resp = requests.get(f'http://microservice:1323/google-cse?query={query}&pages={pages}&id={cse_id}')
            resp = resp.json()
        except Exception as e:
            print(e)
            raise OBPluginError("There was an error fetching CSE results. Please try again")
        results = []
        if resp['results'] is not None:
            for result in resp['results']:
                print('result: ', result)
                burl = result.get('breadcrumbUrl')
                blueprint = CSESearchResultsPlugin.blueprint(
                    result={
                        'title': result.get('titleNoFormatting'),
                        'subtitle': burl.get('host') + ' > '.join(burl.get('crumbs')),
                        'text': result.get('contentNoFormatting')
                    },
                    url=result.get('unescapedUrl'),
                    cache_url=result.get('cacheUrl')
                )
                results.append(blueprint)
        return results
