"""alter bets with dates

Revision ID: ecf7ce054bca
Revises: cba2fbcd6b7e
Create Date: 2021-11-28 09:29:46.009837

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ecf7ce054bca'
down_revision = 'cba2fbcd6b7e'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('bets', sa.Column('close_time', sa.DateTime, nullable=False, server_default=sa.func.now()))
    op.add_column('bets', sa.Column('resolved_time', sa.DateTime, nullable=True))
    op.drop_column('bets', 'result')


def downgrade():
    op.drop_column('bets' 'close_time')
    op.drop_column('bets' 'resolved_time')
    op.add_column('bets', sa.Column('result', sa.Boolean, nullable=True))
