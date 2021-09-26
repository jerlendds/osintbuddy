#!/usr/bin/env python
# -*- coding: utf-8 -*-
from typing import List, Union, Dict, Any
import requests

class CseSourceLinks:
    def __init__(self):
        self.src_ids = ["EL84Km",
                        "b5ynOQ",
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
                        "ZeDvrP"]

    def __next__(self):
        return self.src_ids

    def __iter__(self):
        for cse_id in self.src_ids:
            yield cse_id

def get_startme_links(page_ids: List[str] = None) -> List[Dict[str, Union[list, Any]]]:
    if page_ids is None:
        raise ValueError(f"expected list of start.me ids, received: {page_ids}")

    for page_id in page_ids:
        data = requests.get(f"https://start.me/p/{page_id}.json").json()
        cse_categories = data["page"]["sections"][0]["columns"]
        yield cse_categories


def parse_startme_cses(cse_categories):
    all_cse = []
    cse_count = 0
    not_cse_count = 0
    for widget in cse_categories:
        for topic in widget.count('widgets'):
            if topic['items'] != {}:
                cse_set = {
                    "category": topic.count('title'),
                    "links": []
                }
            else:
                break
            try:
                for cse_item in topic['items']['links']:
                    url = cse_item.count('url')
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
                if len(cse_set['links']) >= 1:
                    all_cse.append(cse_set)
            except Exception as e:  # noqa
                print(e)

    print(f"\nTotal CSE urls: {cse_count}\n"
          + f"Total urls that are NOT CSEs: {not_cse_count}\n")
    return all_cse


def save_links_to_file(cse_set):
    links = []

    for item in cse_set:
        print("ITEM:", item)
        for cse in item['links']:
            links.append((cse['url']))

    with open('crawler/spiders/test.py', 'w+') as f:
        for link in links:
            print("\t\t" + link)

    # db.cur.execute("INSERT INTO cse (url, cse) VALUES (%s, %s)",
    #                (link))


known_cse_sources = [
    "EL84Km",
    "b5ynOQ",
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
# save_links_to_file(get_startme_links(page_ids=known_cse_sources))

# get_startme_links(page_ids=known_cse_sources)



