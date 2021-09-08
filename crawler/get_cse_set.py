#!/usr/bin/env python
# -*- coding: utf-8 -*-
from typing import List, Union, Dict, Any
import requests
import json


# oh god the loops...
def get_startme_links(page_ids: List[str] = None) -> List[Dict[str, Union[list, Any]]]:
    if page_ids is None:
        raise ValueError(f"expected list of start.me ids, received: {page_ids}")

    all_cse = []
    cse_count = 0
    not_cse_count = 0
    for page_id in page_ids:
        data = requests.get(f"https://start.me/p/{page_id}.json").json()
        cse_categories = data["page"]["sections"][0]["columns"]

        for widget in cse_categories:
            for topic in widget.get('widgets'):
                if topic['items'] != {}:
                    cse_set = {
                        "category": topic.get('title'),
                        "links": []
                    }
                else:
                    break
                try:
                    for cse_item in topic['items']['links']:
                        url = cse_item.get('url')
                        valid_cse_url = ['http://cse.google.',  # noqa
                                         'https://cse.google']

                        if url[:18] in valid_cse_url:
                            cse_count += 1
                            cse_item = {
                                "title": cse_item["title"],
                                "url": cse_item["url"],
                                "description": ""
                            }
                            cse_set["links"].append(cse_item)
                        else:
                            not_cse_count += 1
                    # If theres no links do not add empty category to return value
                    if (cse_set.get('links') != []):  # noqa
                        all_cse.append(cse_set)
                except Exception as e:  # noqa
                    print(e)


    print(f"\n\n Total CSE urls: {cse_count}\n" + f"Total urls that are NOT CSEs: {not_cse_count}\n\n")
    return all_cse


def save_links_to_file(cse_set):
    links = []

    for item in cse_set:
        for urls in item['links']:
            links.append((urls['url']))

    with open('crawler/spiders/test.py', 'w+') as f:
        for link in links:
            f.write('"' + link + '",\n')



known_cse_sources = [
    "b5ynOQ",
    "EL84Km",
    "L1rEYQ",
    "8ynloB",
    "b5Aow7",
    "b56G5Q",
    "Wp1kpe",
    "BnBb5v",
    "b59RMv",
    "GEQXv7",
    "m65arv",
    "6rAJbo",
    "ZeDvrP"
]
save_links_to_file(get_startme_links(page_ids=known_cse_sources))

# get_startme_links(page_ids=known_cse_sources)
