# Alembic Configuration

## Python virtualenv setup

Make sure you have python3/pip installed on your local machine (I'm using 3.7). If not [install Python](https://www.python.org/downloads/release/python-3710/) then [install pip](https://pip.pypa.io/en/latest/installing/)

Next, install [virtualenv](https://docs.python.org/3/tutorial/venv.html) if you haven't already

```
pip install virtualenv
```

Next, set up the virtual environment

```
python -m venv venv
```

Next, activate the environment in your terminal

```
source venv/bin/activate
```

You should see a (venv) on the left side of your terminal line now.

Finally, install the dependencies

```
pip install requirements.txt
```

If you install more python libraries using `pip`, make sure to save the dependencies to the requirements file

```
pip freeze > requirements.txt
```

## Create DB Migration

First, create a migration script
```
alembic revision -m "create some table"
```

This will create a new file in the versions folder. Edit this file with the desired migrations e.g.

```py
"""create account table

Revision ID: 1975ea83b712
Revises:
Create Date: 2011-11-08 11:40:27.089406

"""

# revision identifiers, used by Alembic.
revision = '1975ea83b712'
down_revision = None
branch_labels = None

from alembic import op
import sqlalchemy as sa

def upgrade():
    op.create_table(
        'account',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('name', sa.String(50), nullable=False),
        sa.Column('description', sa.Unicode(200)),
    )

def downgrade():
    op.drop_table('account')
```

For more information, here's the [alembic tutorial](https://alembic.sqlalchemy.org/en/latest/tutorial.html)
