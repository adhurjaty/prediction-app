"""seed data

Revision ID: 9b9bec7dfa27
Revises: a90ce4336af4
Create Date: 2021-05-12 19:40:03.376329

"""
from alembic import op
import sqlalchemy as sa
from uuid import uuid4
from os import environ


# revision identifiers, used by Alembic.
revision = '9b9bec7dfa27'
down_revision = 'a90ce4336af4'
branch_labels = None
depends_on = None


def upgrade():
    if environ.get('ENV') == 'Production':
        return
    meta = sa.MetaData(bind=op.get_bind())
    meta.reflect(only=('groups', 'propositions', 'user_group_bridge', 'users', 'votes'))
    groups = sa.Table('groups', meta)
    propositions = sa.Table('propositions', meta)
    user_group_bridge = sa.Table('user_group_bridge', meta)
    users = sa.Table('users', meta)
    votes = sa.Table('votes', meta)

    sooth_sayans = {
        'id': str(uuid4()),
        'name': 'Sooth Sayans'
    }
    boracles = {
        'id': str(uuid4()),
        'name': 'Bore-acles'
    }
    anil = {
        'id': str(uuid4()),
        'display_name': 'Anil Dhurjaty',
        'email': 'adhurjaty@gmail.com',
        'prestige_address': '2c1a72af-b1f1-4697-bc56-9b1df09e41ec',
        'prestige_privatekey': '9d258cc3-076e-4c55-82e7-bbc3b03a64be'
    }
    dan = {
        'id': str(uuid4()),
        'display_name': 'Dan Mcleod',
        'email': 'danoftheclanmcleod@gmail.com',
        'prestige_address': 'ab5130f5-63c8-4343-a565-e2be0d34f6f1',
        'prestige_privatekey': '5582ad52-986a-41fd-ab74-cdc4ca242f52'
    }
    tony = {
        'id': str(uuid4()),
        'display_name': 'Tony Wong',
        'email': 'a.chinaman@gmail.com',
        'prestige_address': 'a31b79a3-127b-4f09-b992-930893a3e179',
        'prestige_privatekey': '86a83597-f8d7-4252-8216-b4b9b8fee188'
    }
    lebron = {
        'id': str(uuid4()),
        'group_id': sooth_sayans['id'],
        'title': 'Will Lebron Have 5 Rings',
        'description': 'Pretty self explanatory',
        'address': 'a6b36b77-6cc5-4984-98b9-0c6f2416a497'
    }
    ari = {
        'id': str(uuid4()),
        'group_id': boracles['id'],
        'title': 'Will Ari Propose to Erica by 11/07',
        'description': 'Will he',
        'address': 'dbe85b14-35d6-4643-90ec-d9fb57941844'
    }
    other_prop = {
        'id': str(uuid4()),
        'group_id': boracles['id'],
        'title': 'Some other prop',
        'description': 'This is a test',
        'address': '617ccc60-d6a0-4a16-b809-3c6512f34d83',
        'result': False
    }
    bridge = [{
        'user_id': anil['id'],
        'group_id': sooth_sayans['id']
    },
    {
        'user_id': anil['id'],
        'group_id': boracles['id']
    },
    {
        'user_id': dan['id'],
        'group_id': sooth_sayans['id']
    },
    {
        'user_id': dan['id'],
        'group_id': boracles['id']
    },
    {
        'user_id': tony['id'],
        'group_id': sooth_sayans['id']
    }]

    op.bulk_insert(groups, [
        sooth_sayans,
        boracles
    ])
    op.bulk_insert(users, [
        anil,
        dan,
        tony
    ])
    op.bulk_insert(propositions, [
        lebron,
        ari,
        other_prop
    ])
    op.bulk_insert(user_group_bridge, bridge)
    op.bulk_insert(votes, [
        {
            'user_id': anil['id'],
            'proposition_id': lebron['id'],
            'vote': True
        },
        {
            'user_id': anil['id'],
            'proposition_id': ari['id'],
            'vote': False
        },
        {
            'user_id': dan['id'],
            'proposition_id': other_prop['id'],
            'vote': True
        }
    ])

def downgrade():
    if environ.get('ENV') == 'Production':
        return
    op.execute('TRUNCATE TABLE groups')
    op.execute('TRUNCATE TABLE propositions')
    op.execute('TRUNCATE TABLE user_group_bridge')
    op.execute('TRUNCATE TABLE users')
    op.execute('TRUNCATE TABLE votes')
