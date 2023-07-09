from urllib.parse import urlparse
import osintbuddy as ob
from osintbuddy.elements import TextInput
from app.plugins.core import WebsitePlugin


class UrlPlugin(ob.Plugin):
    label = 'URL'
    name = 'URL'
    color = '#642CA9'
    node = [
        TextInput(label='URL', icon='link'),
    ]

    @ob.transform(label='To website', icon='world-www')
    async def transform_to_website(self, node, **kwargs):
        domain = urlparse(node.url).netloc
        return WebsitePlugin.blueprint(domain=domain)
