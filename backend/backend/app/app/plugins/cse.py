import json
import urllib
from collections import defaultdict
import httpx
import osintbuddy as ob
from pydantic import BaseModel
from osintbuddy.elements import TextInput, DropdownInput, Title, CopyText
from osintbuddy.errors import OBPluginError
from app.plugins.url import UrlPlugin

cse_link_options = json.load(open("app/plugins/cses.json"))


class CSESearchResultsPlugin(ob.Plugin):
    label = "CSE Result"
    name = "CSE result"
    show_label = False
    color = "#058F63"
    node = [
        Title(label="result"),
        CopyText(label="URL"),
        CopyText(label="Cache URL"),
    ]

    @ob.transform(label="To URL", icon='link')
    async def transform_to_url(self, node, **kwargs):
        return UrlPlugin.blueprint(url=node.url)


class CSESearchPlugin(ob.Plugin):
    label = "CSE Search"
    name = "CSE search"
    color = "#2C7237"
    node = [
        [
            TextInput(label="Query", icon="search"),
            TextInput(label="Pages", icon="123", default="1"),
        ],
        DropdownInput(label="CSE Categories", options=cse_link_options)
    ]

    @ob.transform(label="To cse results", icon="search")
    async def transform_to_cse_results(self, node: BaseModel, **kwargs):
        results = []
        url = node.cse_categories['value']
        if not url:
            raise OBPluginError('The CSE Category field is required to transform.')
        parsed_url = urllib.parse.urlparse(url)
        cse_id = urllib.parse.parse_qs(parsed_url.query)["cx"][0]
        try:
            async with httpx.AsyncClient() as client:
                # @todo add support for n pages... {node.pages}
                resp = await client.get(
                    f'http://microservice:1323/google-cse?query={node.query}&pages={"1"}&id={cse_id}',
                    timeout=None
                )
                resp = defaultdict(None, **resp.json())
        except Exception:
            raise OBPluginError(
                "There was an error fetching CSE results. Please try again later"
            )
        results = []
        if resp and resp.get("results"):
            for result in resp["results"]:
                burl = result.get("breadcrumbUrl")
                blueprint = CSESearchResultsPlugin.blueprint(
                    result={
                        "title": result.get("titleNoFormatting"),
                        "subtitle": burl.get("host") + str(burl.get("crumbs")),
                        "text": result.get("contentNoFormatting"),
                    },
                    url=result.get("unescapedUrl"),
                    cache_url=result.get("cacheUrl"),
                )
                results.append(blueprint)
        return results
