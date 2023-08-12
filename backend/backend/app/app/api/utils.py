import re
import urllib
from typing import List
from pydantic import EmailStr

MAP_KEY = '___obmap___'


def chunks(lst, n):
    """Yield successive n-sized chunks from lst."""
    for i in range(0, len(lst), n):
        yield lst[i:i + n]


def find_emails(value: str) -> List[EmailStr]:
    emails = []
    match = re.search(r"[\w.+-]+@[\w-]+\.[\w.-]+", value)
    if match is not None:
        email = match.group(0)
        # if trailing dot, remove. @todo improve regex
        if email[len(email) - 1] == ".":
            emails.append(email[0: len(email) - 2])
        else:
            emails.append(email)
    return list(set(emails))


def to_clean_domain(value: str) -> str:
    if "http://" not in value and "https://" not in value:
        value = "https://" + value
    url = urllib.parse.urlparse(value)
    split_domain = url.netloc.split(".")
    if len(split_domain) >= 3:
        split_domain.pop(0)
    domain = ".".join(split_domain)
    return domain


def plugin_source_template(entity):
    return f"""import osintbuddy as ob
from osintbuddy.elements import TextInput

class {''.join(x for x in entity.label.title() if not x.isspace())}(ob.Plugin):
    label = '{entity.label}'
    icon = 'atom'   # https://tabler-icons.io/
    color = '#FFD166'

    author = ''
    description = ''

    node = [
        TextInput(label='Example', icon='radioactive')
    ]

    @ob.transform(label='To example', icon='atom')
    async def transform_example(self, node, use):
        WebsitePlugin = await ob.Registry.get_plugin('website')
        website_plugin = WebsitePlugin()
        return website_plugin.blueprint(domain=node.example)
\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n
    """