"""remove bet address

Revision ID: 25b5294049af
Revises: bb8b76e9e253
Create Date: 2022-02-06 18:51:34.119815

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '25b5294049af'
down_revision = 'bb8b76e9e253'
branch_labels = None
depends_on = None


def upgrade():
    op.drop_column('bets', 'address')


def downgrade():
    op.add_column('bets', sa.Column('address', sa.String(50), nullable=False))
