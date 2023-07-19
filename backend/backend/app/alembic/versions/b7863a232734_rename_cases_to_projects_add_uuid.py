"""rename cases to projects, add uuid

Revision ID: b7863a232734
Revises: 32ff1ab4363a
Create Date: 2023-06-28 04:30:55.646727

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'b7863a232734'
down_revision = '32ff1ab4363a'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('projects',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('uuid', sa.UUID(), nullable=True),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('description', sa.String(), nullable=True),
    sa.Column('updated', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.Column('created', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_projects_id'), 'projects', ['id'], unique=False)
    op.create_index(op.f('ix_projects_uuid'), 'projects', ['uuid'], unique=False)
    op.drop_index('ix_cases_id', table_name='cases')
    op.drop_table('cases')
    op.drop_index('ix_google_search_id', table_name='google_search')
    op.drop_table('google_search')
    op.add_column('proxies', sa.Column('host', sa.String(), nullable=False))
    op.drop_column('proxies', 'url')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('proxies', sa.Column('url', sa.VARCHAR(), autoincrement=False, nullable=False))
    op.drop_column('proxies', 'host')
    op.create_table('google_search',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('search_query', sa.VARCHAR(), autoincrement=False, nullable=False),
    sa.Column('updated', postgresql.TIMESTAMP(), autoincrement=False, nullable=True),
    sa.Column('created', postgresql.TIMESTAMP(), server_default=sa.text('now()'), autoincrement=False, nullable=True),
    sa.PrimaryKeyConstraint('id', name='google_search_pkey')
    )
    op.create_index('ix_google_search_id', 'google_search', ['id'], unique=False)
    op.create_table('cases',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('name', sa.VARCHAR(), autoincrement=False, nullable=False),
    sa.Column('description', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('updated', postgresql.TIMESTAMP(), autoincrement=False, nullable=True),
    sa.Column('created', postgresql.TIMESTAMP(), server_default=sa.text('now()'), autoincrement=False, nullable=True),
    sa.PrimaryKeyConstraint('id', name='cases_pkey')
    )
    op.create_index('ix_cases_id', 'cases', ['id'], unique=False)
    op.drop_index(op.f('ix_projects_uuid'), table_name='projects')
    op.drop_index(op.f('ix_projects_id'), table_name='projects')
    op.drop_table('projects')
    # ### end Alembic commands ###