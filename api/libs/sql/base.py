from sqlalchemy.ext.declarative import declarative_base
from libs.flask import app
import uuid

Base = declarative_base()
Base.query = app.db.session.query_property()


def genUUID():
    return str(uuid.uuid4())
