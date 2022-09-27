from sqlalchemy import String
from sqlalchemy.dialects.mssql import UNIQUEIDENTIFIER
from sqlalchemy.orm import relationship
from ..base import Base, genUUID
from flask_sqlalchemy import SQLAlchemy
from libs.flask import app
db = SQLAlchemy(app)

#Location table
class Locations(Base):
    """
    Model for the Location table
    """
    __tablename__ = 'locations'
    id = db.Column(UNIQUEIDENTIFIER, primary_key=True, default=genUUID)
    owner = db.Column(String(128), unique=False)
    smartystreets = relationship("SmartyStreets", back_populates="location", uselist = False)
    googleplaces = relationship("GooglePlaces", back_populates="location", uselist = False)
    geoframes = relationship("GeoFrames", back_populates="location")