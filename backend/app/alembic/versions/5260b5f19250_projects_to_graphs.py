"""projects to graphs

Revision ID: 5260b5f19250
Revises: d51c30bacade
Create Date: 2023-10-24 18:08:13.190355

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '5260b5f19250'
down_revision = 'd51c30bacade'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table('graphs',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('uuid', sa.UUID(), nullable=True),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('description', sa.String(length=512), nullable=True),
    sa.Column('is_favorite', sa.Boolean(), nullable=False),
    sa.Column('last_seen', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
    sa.Column('updated', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
    sa.Column('created', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_graphs_uuid'), 'graphs', ['uuid'], unique=False)
    op.drop_index('ix_projects_uuid', table_name='projects')
    op.drop_table('project_entities')
    op.drop_table('projects')


def downgrade():
    op.create_table('project_entities',
    sa.Column('project_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('entity_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.ForeignKeyConstraint(['entity_id'], ['entities.id'], name='project_entities_entity_id_fkey'),
    sa.ForeignKeyConstraint(['project_id'], ['projects.id'], name='project_entities_project_id_fkey'),
    sa.PrimaryKeyConstraint('project_id', 'entity_id', name='project_entities_pkey')
    )
    op.create_table('projects',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('uuid', sa.UUID(), autoincrement=False, nullable=True),
    sa.Column('name', sa.VARCHAR(), autoincrement=False, nullable=False),
    sa.Column('description', sa.VARCHAR(length=512), autoincrement=False, nullable=True),
    sa.Column('updated', postgresql.TIMESTAMP(), server_default=sa.text('now()'), autoincrement=False, nullable=False),
    sa.Column('created', postgresql.TIMESTAMP(), server_default=sa.text('now()'), autoincrement=False, nullable=True),
    sa.Column('is_favorite', sa.BOOLEAN(), autoincrement=False, nullable=False),
    sa.Column('last_seen', postgresql.TIMESTAMP(), server_default=sa.text('now()'), autoincrement=False, nullable=False),
    sa.PrimaryKeyConstraint('id', name='projects_pkey')
    )
    op.create_index('ix_projects_uuid', 'projects', ['uuid'], unique=False)
    op.drop_index(op.f('ix_graphs_uuid'), table_name='graphs')
    op.drop_table('graphs')
