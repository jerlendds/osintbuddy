---
title: Writing plugins
pageTitle: OSINTBuddy - Creating your first plugin
description:
---

## Creating your first plugin

In this guide, we will dive into creating a custom plugin for OSINTBuddy that extends its capabilities. This will enable you to incorporate additional sources and transformations into the OSINTBuddy toolbox. We will use the provided code example as a reference to build our plugin.

### Step-by-step guide to create a new plugin

Start by importing the necessary modules:

```py
import socket
import osintbuddy as ob
```

Define a class for your plugin, inheriting from `ob.Plugin`. Set the required attributes such as `label`, and optionally set an `icon` like `world-www` (using [tabler-icon](https://tabler-icons.io/) names), and a `node` which contains a list of elements used as a blueprint for creating the node displayed on the OSINTBuddy UI.

```py
class WebsitePlugin(ob.Plugin):
    label = 'Website'
    name = 'Website'
    color = '#1D1DB8'
    icon = 'world-www'
    node = [
        ob.elements.TextInput(label='Domain', icon='world-www'),
    ]
```

Now, define a transformation method to gather and transform the data from the input node. In this case, the transform_to_ip function uses the `socket.gethostbyname()` Python module to obtain the IP address for a given domain. Decorate the method with `@transform()` and set the metadata attributes such as `label` and `icon`.

```py
@ob.transform(label='To IP', icon='building-broadcast-tower')
def transform_to_ip(self, node, **kwargs):
    blueprint = IPAddressPlugin.blueprint(
        ip_address=socket.gethostbyname(node.domain)
    )
    return blueprint
```
## Using the new plugin

To use the new plugin, simply add it to the existing OSINTBuddy plugins folder inside the application, in development mode it will be detected automatically and loaded by the platform. Once added, you can access your 'Website' plugin and use the 'To IP' transformation.

Creating a custom plugin for OSINTBuddy is an easy and effective way to enhance the capabilities of the tool, allowing you to fetch information from additional sources or transform the data in new ways. By following this guide and using the provided code example as a reference, you'll be able to create your own unique plugins to extend the functionality of OSINTBuddy to fit your specific needs.


### Full example

```py
import socket
import osintbuddy as ob

class WebsitePlugin(ob.Plugin):
    label = 'Website'
    name = 'Website'
    color = '#1D1DB8'
    icon = 'world-www'
    node = [
        ob.elements.TextInput(label='Domain', icon='world-www'),
    ]

    @ob.transform(label='To IP', icon='building-broadcast-tower')
    def transform_to_ip(self, node, use):
        blueprint = IPAddressPlugin.blueprint(
            ip_address=socket.gethostbyname(node.domain)
        )
        return blueprint
```

