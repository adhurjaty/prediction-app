"""init tables

Revision ID: a90ce4336af4
Revises: 
Create Date: 2021-04-07 08:48:22.845768

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID


# revision identifiers, used by Alembic.
revision = 'a90ce4336af4'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'users',
        sa.Column('id', UUID(as_uuid=True), primary_key=True),
        sa.Column('display_name', sa.String(50), nullable=False),
        sa.Column('email', sa.String(50), nullable=False),
        sa.Column('prestige_address', sa.String(50), nullable=True),
        sa.Column('mainnet_address', sa.String(50), nullable=True),
        sa.Column('prestige_privatekey', sa.String(50), nullable=True),
    )
    op.create_table(
        'groups',
        sa.Column('id', UUID(as_uuid=True), primary_key=True),
        sa.Column('name', sa.String(50), nullable=False)
    )
    op.create_table(
        'user_group_bridge',
        sa.Column('user_id', UUID(as_uuid=True), sa.ForeignKey('users.id')),
        sa.Column('group_id', UUID(as_uuid=True), sa.ForeignKey('groups.id'))
    )
    op.create_primary_key(
        'pk_user_group', 
        'user_group_bridge', 
        ['user_id', 'group_id']
    )
    op.create_table(
        'propositions',
        sa.Column('id', UUID(as_uuid=True), primary_key=True),
        sa.Column('group_id', UUID(as_uuid=True), sa.ForeignKey('groups.id')),
        sa.Column('title', sa.String(50), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('address', sa.String(50), nullable=False),
        sa.Column('result', sa.Boolean(), nullable=True)
    )
    op.create_table(
        'votes',
        sa.Column('user_id', UUID(as_uuid=True), sa.ForeignKey('users.id')),
        sa.Column('proposition_id', UUID(as_uuid=True), sa.ForeignKey('propositions.id')),
        sa.Column('vote', sa.Boolean(), nullable=False)
    )

def downgrade():
    op.drop_table('users')
    op.drop_table('groups')
    op.drop_table('user_group_bridge')
    op.drop_table('propositions')
    op.drop_table('votes')
    