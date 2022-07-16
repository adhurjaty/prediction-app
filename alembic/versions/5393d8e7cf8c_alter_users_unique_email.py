"""alter users unique email

Revision ID: 5393d8e7cf8c
Revises: 25b5294049af
Create Date: 2022-07-16 11:56:06.286518

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '5393d8e7cf8c'
down_revision = '25b5294049af'
branch_labels = None
depends_on = None


def upgrade():
    op.create_unique_constraint('uq_user_email', 'users', ['email'])



def downgrade():
    op.drop_constraint(constraint_name='uq_user_email', table_name='users', type_='unique')

