"""update casdoor user

Revision ID: fffdefe1a8a5
Revises: fab5d9c099df
Create Date: 2023-11-01 00:42:05.781486

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'fffdefe1a8a5'
down_revision = 'fab5d9c099df'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('user', sa.Column('uuid', sa.UUID(), nullable=False))
    op.add_column('user', sa.Column('cid', sa.UUID(), nullable=False))
    op.add_column('user', sa.Column('name', sa.String(length=64), nullable=False))
    op.add_column('user', sa.Column('email_verified', sa.Boolean(), nullable=False))
    op.add_column('user', sa.Column('avatar', sa.String(), nullable=False))
    op.add_column('user', sa.Column('phone', sa.String(), nullable=False))
    op.add_column('user', sa.Column('display_name', sa.String(length=32), nullable=False))
    op.add_column('user', sa.Column('first_name', sa.String(), nullable=False))
    op.add_column('user', sa.Column('last_name', sa.String(), nullable=False))
    op.add_column('user', sa.Column('created_time', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False))
    op.add_column('user', sa.Column('updated_time', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False))
    op.add_column('user', sa.Column('is_admin', sa.Boolean(), nullable=False))
    op.add_column('user', sa.Column('is_deleted', sa.Boolean(), nullable=False))
    op.add_column('user', sa.Column('is_forbidden', sa.Boolean(), nullable=False))
    op.add_column('user', sa.Column('is_online', sa.Boolean(), nullable=False))
    op.drop_index('ix_user_full_name', table_name='user')
    op.drop_index('ix_user_email', table_name='user')
    op.create_index(op.f('ix_user_email'), 'user', ['email'], unique=False)
    op.create_index(op.f('ix_user_cid'), 'user', ['cid'], unique=False)
    op.drop_column('user', 'disabled')
    op.drop_column('user', 'full_name')
    op.drop_column('user', 'is_active')
    op.drop_column('user', 'modified')
    op.drop_column('user', 'created')
    op.drop_column('user', 'is_superuser')
    op.drop_column('user', 'hashed_password')


def downgrade():
    op.add_column('user', sa.Column('hashed_password', sa.VARCHAR(), autoincrement=False, nullable=False))
    op.add_column('user', sa.Column('is_superuser', sa.BOOLEAN(), autoincrement=False, nullable=False))
    op.add_column('user', sa.Column('created', postgresql.TIMESTAMP(timezone=True), server_default=sa.text('now()'), autoincrement=False, nullable=False))
    op.add_column('user', sa.Column('modified', postgresql.TIMESTAMP(timezone=True), server_default=sa.text('now()'), autoincrement=False, nullable=False))
    op.add_column('user', sa.Column('is_active', sa.BOOLEAN(), autoincrement=False, nullable=False))
    op.add_column('user', sa.Column('full_name', sa.VARCHAR(), autoincrement=False, nullable=False))
    op.add_column('user', sa.Column('disabled', sa.BOOLEAN(), autoincrement=False, nullable=False))
    op.drop_index(op.f('ix_user_cid'), table_name='user')
    op.drop_index(op.f('ix_user_email'), table_name='user')
    op.create_index('ix_user_email', 'user', ['email'], unique=False)
    op.create_index('ix_user_full_name', 'user', ['full_name'], unique=False)
    op.drop_column('user', 'is_online')
    op.drop_column('user', 'is_forbidden')
    op.drop_column('user', 'is_deleted')
    op.drop_column('user', 'is_admin')
    op.drop_column('user', 'updated_time')
    op.drop_column('user', 'created_time')
    op.drop_column('user', 'last_name')
    op.drop_column('user', 'first_name')
    op.drop_column('user', 'display_name')
    op.drop_column('user', 'phone')
    op.drop_column('user', 'avatar')
    op.drop_column('user', 'email_verified')
    op.drop_column('user', 'name')
    op.drop_column('user', 'cid')
    op.drop_column('user', 'uuid')
