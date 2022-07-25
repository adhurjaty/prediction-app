"""drop votes table

Revision ID: 0151be9e9519
Revises: 5393d8e7cf8c
Create Date: 2022-07-16 12:37:21.689705

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID
from uuid import uuid4


# revision identifiers, used by Alembic.
revision = '0151be9e9519'
down_revision = '5393d8e7cf8c'
branch_labels = None
depends_on = None


def upgrade():
    op.drop_table('votes')



def downgrade():
    op.create_table(
        'votes',
        sa.Column('user_id', UUID(as_uuid=True), sa.ForeignKey('users.id')),
        sa.Column('proposition_id', UUID(as_uuid=True), sa.ForeignKey('propositions.id')),
        sa.Column('vote', sa.Boolean(), nullable=False)
    )
