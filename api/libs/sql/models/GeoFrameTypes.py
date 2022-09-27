from sqlalchemy import String
from sqlalchemy.dialects.mssql import UNIQUEIDENTIFIER
from ..base import Base, genUUID
from flask_sqlalchemy import SQLAlchemy
from libs.flask import app
db = SQLAlchemy(app)

class GeoFrameTypes(Base):
    __tablename__ = 'geoframetypes'
    id = db.Column(UNIQUEIDENTIFIER, primary_key=True, default=genUUID)
    name = db.Column(String(128), unique=True)