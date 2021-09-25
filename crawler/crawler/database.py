import os

import psycopg2


class Database(object):
    db_name = os.getenv('POSTGRES_DB')
    db_user = os.getenv('POSTGRES_USER')
    db_server = os.getenv('POSTGRES_SERVER')
    db_password = os.getenv('POSTGRES_PASSWORD')

    def __init__(self):
        self.conn = self._get_conn()
        self.cur = self._get_cur()

    def _get_conn(self):
        return psycopg2.connect(dbname=self.db_name, user=self.db_user,
                                password=self.db_password, host=self.db_server)

    def _get_cur(self):
        return self.conn.cursor()

    def insert_category(self, category):
        sql_insert_return_id = "INSERT INTO search_category (category) VALUES (%s) RETURNING id;"
        try:
            self.cur.execute(sql_insert_return_id, (category,))
            return_id = self.cur.fetchone()[0]
            self.conn.commit()
            return return_id
        except psycopg2.InterfaceError as e:
            print(e)
            self.cur.close()
            self.cur = self.conn.cursor()

    def insert_cse_link(self, category_id, title, url):
        sql_insert_return_id = "INSERT INTO cse (url, title, search_category_id) VALUES (%s, %s, %s) RETURNING id;"
        try:
            self.cur.execute(sql_insert_return_id, (url, title, category_id))
            return_id = self.cur.fetchone()[0]
            self.conn.commit()
            return return_id
        except psycopg2.InterfaceError as e:
            print(e)
            self.cur.close()
            self.cur = self.conn.cursor()


db = Database()
