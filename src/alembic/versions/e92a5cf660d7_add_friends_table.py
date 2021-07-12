"""add friends table

Revision ID: e92a5cf660d7
Revises: 9b9bec7dfa27
Create Date: 2021-07-12 16:20:12.780441

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID


# revision identifiers, used by Alembic.
revision = 'e92a5cf660d7'
down_revision = '9b9bec7dfa27'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'friends_bridge',
        sa.Column('user_id', UUID(as_uuid=True), sa.ForeignKey('users.id')),
        sa.Column('friend_id', UUID(as_uuid=True), sa.ForeignKey('users.id')),
    )


def downgrade():
    op.drop_table('friends_bridge')
    
