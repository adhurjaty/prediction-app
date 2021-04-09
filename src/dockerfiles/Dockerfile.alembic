FROM python:3.7

RUN mkdir /opt/alembic
ADD alembic /opt/alembic/.
WORKDIR /opt/alembic

RUN pip install alembic psycopg2

ENTRYPOINT ["alembic"]
CMD ["upgrade", "head"]