# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html
import json
import os
import psycopg2
from scrapy.exceptions import DropItem

# useful for handling different item types with a single interface
from itemadapter import ItemAdapter
search_data = {
    "results": [
        {
          "clicktrackUrl": "https://www.google.com/url?client=internal-element-cse&cx=009049714591083331396:i7cetsiiqru&q=https://ecfsapi.fcc.gov/file/60001027529.pdf&sa=U&ved=2ahUKEwiXocDH9OnyAhUT7J4KHbAcDVUQFnoECAAQAQ&usg=AOvVaw3ywN5k2RxhilM2FbN8pM_b",
          "content": "\u003cb\u003ealexandra\u003c/b\u003e wymetal ... \u003cb\u003eAlex\u003c/b\u003e. Maccollom. Carmichael. CA. UNITED STATES ... \u003cb\u003eSlugoski\u003c/b\u003e. West Haven. CT. UNITED STATES. Jean. Thorsen. Groton, CT.",
          "contentNoFormatting": "alexandra wymetal ... Alex. Maccollom. Carmichael. CA. UNITED STATES ... Slugoski. West Haven. CT. UNITED STATES. Jean. Thorsen. Groton, CT.",
          "title": "First Name Last Name City State Country Personal Comment ...",
          "titleNoFormatting": "First Name Last Name City State Country Personal Comment ...",
          "formattedUrl": "https://ecfsapi.fcc.gov/file/60001027529.pdf",
          "unescapedUrl": "https://ecfsapi.fcc.gov/file/60001027529.pdf",
          "url": "https://ecfsapi.fcc.gov/file/60001027529.pdf",
          "visibleUrl": "ecfsapi.fcc.gov",
          "richSnippet": {
            "cseImage": {
              "src": "x-raw-image:///6066ef2d8e5ea12a189a4b6971147a28e71e8c0beb56cafc64bba70604b7454e"
            },
            "metatags": {
              "moddate": "D:20150210132932-05'00'",
              "creationdate": "D:20150210132932-05'00'",
              "creator": "PScript5.dll Version 5.2.2",
              "author": "ecfs.pc1",
              "producer": "Acrobat Distiller 11.0 (Windows)",
              "title": "60001027529.xlsx"
            },
            "cseThumbnail": {
              "src": "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSAJKRRQcc02pnmrSOBlg-EVr9cB56IadhBH2lEZit4gEnrO_hiCqFJjZ-C",
              "width": "255",
              "height": "197"
            }
          },
          "breadcrumbUrl": {
            "host": "ecfsapi.fcc.gov",
            "crumbs": [
              "file"
            ]
          },
          "fileFormat": "PDF/Adobe Acrobat"
        }
    ]
}


class CsePipeline:
    db_name = os.getenv('POSTGRES_DB')
    db_user = os.getenv('POSTGRES_USER')
    db_server = os.getenv('POSTGRES_SERVER')
    db_password = os.getenv('POSTGRES_PASSWORD')

    def __init__(self):
        self.conn = psycopg2.connect(dbname=self.db_name, user=self.db_user,
                                     password=self.db_password, host=self.db_server)
        self.cur = self.conn.cursor()

    def open_spider(self, spider):
        pass

    def close_spider(self, spider):
        self.cur.close()
        self.conn.close()

    def process_item(self, item, spider):
        serps = []
        results = item.get('results')
        if results and len(results) > 0:
            for result in results:
                serp = {
                    'title': result.get('titleNoFormatting'),
                    'description': result.get('contentNoFormatting'),
                    'url': result.get('url'),
                    'domain': result['breadcrumbUrl'].get('host')
                }
                # TODO: Store other potentially useful values
                # try:
                #     serp['imgUrl'] = result.get('richSnippet')['cseImage']['src']
                # except KeyError:
                #     continue
                self.cur.execute("INSERT INTO search_result (title, description, url)"
                                 " VALUES (%s, %s, %s)",
                                 (serp['title'], serp['description'], serp['url']))
                serps.append(serp)
                self.conn.commit()
