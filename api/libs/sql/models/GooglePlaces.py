from ..base import Base, genUUID
from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.mssql import UNIQUEIDENTIFIER
from flask_sqlalchemy import SQLAlchemy
from libs.flask import app
db = SQLAlchemy(app)

class GooglePlaces(Base):
    """
    Model for the Google Places table
    """
    __tablename__ = 'googleplaces'
    id = db.Column(UNIQUEIDENTIFIER, primary_key=True, default=genUUID)
    location_id = db.Column(UNIQUEIDENTIFIER, ForeignKey('locations.id'))
    md5 = db.Column(String(), unique=False)
    location = relationship("Locations", back_populates="googleplaces")