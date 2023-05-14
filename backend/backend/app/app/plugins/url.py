from urllib.parse import urlparse
from osintbuddy.plugins import OBPlugin, transform
from osintbuddy.node import TextInput
from app.plugins.core import WebsitePlugin


class UrlPlugin(OBPlugin):
    label = 'URL'
    name = 'URL'
    color = '#642CA9'
    node = [
        TextInput(label='URL', icon='link'),
    ]

    @transform(label='To website', icon='world-www')
    def transform_to_website(self, node, **kwargs):
        domain = urlparse(node['data'][0]).netloc
        return WebsitePlugin.blueprint(domain=domain)
