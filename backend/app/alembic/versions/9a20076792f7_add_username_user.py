"""add username user

Revision ID: 9a20076792f7
Revises: 5260b5f19250
Create Date: 2023-10-28 01:03:22.221486

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '9a20076792f7'
down_revision = '5260b5f19250'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('user', sa.Column('username', sa.String(length=80), nullable=False))
    op.alter_column('user', 'full_name',
               existing_type=sa.VARCHAR(),
               nullable=False)
    op.alter_column('user', 'is_active',
               existing_type=sa.BOOLEAN(),
               nullable=False)
    op.alter_column('user', 'is_superuser',
               existing_type=sa.BOOLEAN(),
               nullable=False)
    op.alter_column('user', 'modified',
               existing_type=postgresql.TIMESTAMP(timezone=True),
               nullable=False,
               existing_server_default=sa.text('now()'))
    op.alter_column('user', 'created',
               existing_type=postgresql.TIMESTAMP(timezone=True),
               nullable=False,
               existing_server_default=sa.text('now()'))
    op.drop_index('ix_user_id', table_name='user')
    op.create_index(op.f('ix_user_username'), 'user', ['username'], unique=False)


def downgrade():
    op.drop_index(op.f('ix_user_username'), table_name='user')
    op.create_index('ix_user_id', 'user', ['id'], unique=False)
    op.alter_column('user', 'created',
               existing_type=postgresql.TIMESTAMP(timezone=True),
               nullable=True,
               existing_server_default=sa.text('now()'))
    op.alter_column('user', 'modified',
               existing_type=postgresql.TIMESTAMP(timezone=True),
               nullable=True,
               existing_server_default=sa.text('now()'))
    op.alter_column('user', 'is_superuser',
               existing_type=sa.BOOLEAN(),
               nullable=True)
    op.alter_column('user', 'is_active',
               existing_type=sa.BOOLEAN(),
               nullable=True)
    op.alter_column('user', 'full_name',
               existing_type=sa.VARCHAR(),
               nullable=True)
    op.drop_column('user', 'username')
