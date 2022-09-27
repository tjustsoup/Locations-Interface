from ..base import Base, genUUID
from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.mssql import UNIQUEIDENTIFIER
from flask_sqlalchemy import SQLAlchemy
from libs.flask import app
from libs.sql.types.Geography import Geography
db = SQLAlchemy(app)

class GeoFrames(Base):
    """
    Model for the frame table
    """
    __tablename__ = 'geoframes'
    id = db.Column(UNIQUEIDENTIFIER, primary_key=True, default=genUUID)
    esq_id = db.Column(String(128), unique=False)
    geoframe = db.Column(Geography(), unique=False)
    location_id = db.Column(UNIQUEIDENTIFIER, ForeignKey('locations.id'))
    location = relationship("Locations", back_populates="geoframes")
    request_id = db.Column(UNIQUEIDENTIFIER, ForeignKey('geoframingrequests.id'))
    request = relationship("GeoFramingRequests", back_populates="geoframes")
    geoframetype_id = db.Column(UNIQUEIDENTIFIER, ForeignKey('geoframetypes.id'))
    geoframetype = relationship("GeoFrameTypes")