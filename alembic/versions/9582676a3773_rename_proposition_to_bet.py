"""rename proposition to bet

Revision ID: 9582676a3773
Revises: e92a5cf660d7
Create Date: 2021-07-21 20:11:52.354801

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '9582676a3773'
down_revision = 'e92a5cf660d7'
branch_labels = None
depends_on = None


def upgrade():
    op.rename_table('propositions', 'bets')


def downgrade():
    op.rename_table('bets', 'propositions')
