"""add user bet results

Revision ID: bb8b76e9e253
Revises: ecf7ce054bca
Create Date: 2021-11-28 09:52:41.349491

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID


# revision identifiers, used by Alembic.
revision = 'bb8b76e9e253'
down_revision = 'ecf7ce054bca'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table('user_bet_results',
        sa.Column('user_id', UUID(as_uuid=True), sa.ForeignKey('users.id')),
        sa.Column('bet_id', UUID(as_uuid=True), sa.ForeignKey('bets.id')),
        sa.Column('has_won', sa.Boolean(), nullable=False))


def downgrade():
    op.drop_table('user_bet_results')
