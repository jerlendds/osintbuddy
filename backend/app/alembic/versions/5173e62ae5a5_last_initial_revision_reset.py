"""last initial revision reset

Revision ID: 5173e62ae5a5
Revises: 
Create Date: 2023-07-23 16:27:04.569460

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '5173e62ae5a5'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table('entities',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('uuid', sa.UUID(), nullable=False),
    sa.Column('label', sa.String(length=64), nullable=False),
    sa.Column('author', sa.String(), nullable=False),
    sa.Column('description', sa.String(length=256), nullable=True),
    sa.Column('source', sa.String(), nullable=False),
    sa.Column('updated', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
    sa.Column('created', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('projects',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('uuid', sa.UUID(), nullable=True),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('description', sa.String(length=512), nullable=True),
    sa.Column('updated', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
    sa.Column('created', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_projects_uuid'), 'projects', ['uuid'], unique=False)
    op.create_table('proxy_type',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_proxy_type_id'), 'proxy_type', ['id'], unique=False)
    op.create_table('project_entities',
    sa.Column('project_id', sa.Integer(), nullable=False),
    sa.Column('entity_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['entity_id'], ['entities.id'], ),
    sa.ForeignKeyConstraint(['project_id'], ['projects.id'], ),
    sa.PrimaryKeyConstraint('project_id', 'entity_id')
    )
    op.create_table('proxies',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('host', sa.String(), nullable=False),
    sa.Column('username', sa.Integer(), nullable=True),
    sa.Column('password', sa.Integer(), nullable=True),
    sa.Column('proxy_type_id', sa.Integer(), nullable=True),
    sa.Column('created', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.ForeignKeyConstraint(['proxy_type_id'], ['proxy_type.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_proxies_id'), 'proxies', ['id'], unique=False)


def downgrade():
    op.drop_index(op.f('ix_proxies_id'), table_name='proxies')
    op.drop_table('proxies')
    op.drop_table('project_entities')
    op.drop_index(op.f('ix_proxy_type_id'), table_name='proxy_type')
    op.drop_table('proxy_type')
    op.drop_index(op.f('ix_projects_uuid'), table_name='projects')
    op.drop_table('projects')
    op.drop_table('entities')
