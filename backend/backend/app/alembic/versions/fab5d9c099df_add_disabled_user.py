"""add disabled user

Revision ID: fab5d9c099df
Revises: 9a20076792f7
Create Date: 2023-10-28 01:13:44.024665

"""
import os
from alembic import op
import sqlalchemy as sa

from sqlalchemy_utils import database_exists, create_database, drop_database


# revision identifiers, used by Alembic.
revision = 'fab5d9c099df'
down_revision = '9a20076792f7'
branch_labels = None
depends_on = None

def get_url(db_name: str = None):
    user = os.getenv("POSTGRES_USER", "postgres")
    password = os.getenv("POSTGRES_PASSWORD", "password")
    server = os.getenv("POSTGRES_SERVER", "db")
    db = os.getenv("POSTGRES_DB", "app")
    if isinstance(db_name, str) and db_name is not None:
        db = db_name
    return f"postgresql://{user}:{password}@{server}/{db}"


def upgrade():
    op.add_column('user', sa.Column('disabled', sa.Boolean(), nullable=False))
    # Casdoor supports PostgreSQL...
    engine = sa.create_engine(get_url(db_name='casdoor'))
    if not database_exists(engine.url):
        create_database(engine.url)
    create_user_sql = sa.text((
        f"CREATE USER {sa.quoted_name(os.getenv('CASDOOR_PG_USER', 'casdoor'), False)} "
        "WITH SUPERUSER PASSWORD :database_password")).bindparams(
        database_password=os.getenv("CASDOOR_PG_PASSWORD", "casdoorpassword")
    ).compile(compile_kwargs={"literal_binds": True})
    conn = engine.connect()
    conn.execute(create_user_sql)
    conn.commit()

def downgrade():
    op.drop_column('user', 'disabled')
    # https://casdoor.org/docs/basic/server-installation/#configure-database
    engine = sa.create_engine(get_url(db_name='casdoor'))
    if database_exists(engine.url):
        drop_database(engine.url)