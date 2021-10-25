"""seed friends table

Revision ID: cba2fbcd6b7e
Revises: 9582676a3773
Create Date: 2021-10-22 21:29:38.778564

"""
from alembic import op
import sqlalchemy as sa
from itertools import permutations


# revision identifiers, used by Alembic.
revision = 'cba2fbcd6b7e'
down_revision = '9582676a3773'
branch_labels = None
depends_on = None


def upgrade():
    meta = sa.MetaData(bind=op.get_bind())
    meta.reflect(only=('users', 'friends_bridge'))
    friends_bridge = sa.Table('friends_bridge', meta)

    con = op.get_bind()
    users = [str(x[0]) for x in con.execute('SELECT id FROM users')]

    friends_bridge_members = [{
        'user_id': me,
        'friend_id': you
    } for me, you in permutations(users, 2)]
    
    op.bulk_insert(friends_bridge, friends_bridge_members)


def downgrade():
    op.execute('DELETE FROM friends_bridge')
