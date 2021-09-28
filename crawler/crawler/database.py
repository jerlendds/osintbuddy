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


db = Database()
