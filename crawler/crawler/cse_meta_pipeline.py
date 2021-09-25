from .database import db


class CseMetaPipeline:
    def open_spider(self, spider):
        pass

    def close_spider(self, spider):
        db.close()

    def process_item(self, item, spider):
        category_id = db.insert_category(item['category'])

        cse_count = 0
        for cse_resource in item['links']:
            url = cse_resource['url']
            valid_cse_url = ['http://cse.google.',  # noqa
                             'https://cse.google']

            if url[:18] in valid_cse_url:
                cse_count += 1
                print("CATEGORY_ID", category_id)
                db.insert_cse_link(category_id, cse_resource["title"], cse_resource["url"])
