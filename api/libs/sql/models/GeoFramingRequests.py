from sqlalchemy import String, Date
from sqlalchemy.dialects.mssql import UNIQUEIDENTIFIER
from sqlalchemy.orm import relationship
from ..base import Base, genUUID
from flask_sqlalchemy import SQLAlchemy
from libs.flask import app
db = SQLAlchemy(app)

#Location table
class GeoFramingRequests(Base):
    """
    Model for the Location table
    """
    __tablename__ = 'geoframingrequests'
    id = db.Column(UNIQUEIDENTIFIER, primary_key=True, default=genUUID)
    request_by = db.Column(String(128))
    date_requested = db.Column(Date())
    date_due = db.Column(Date())
    geoframes = relationship("GeoFrames", back_populates="request")