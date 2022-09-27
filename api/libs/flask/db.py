from libs.azure.sql import GenerateAzSQLConnectionString
from libs.azure.credentials import AccountToken
import struct
from . import app
import os

from flask_sqlalchemy import SQLAlchemy

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SQLALCHEMY_DATABASE_URI"] = GenerateAzSQLConnectionString(os.environ.get("flask_sql_instance"), os.environ.get("flask_sql_database"))

def get_db():
    db = SQLAlchemy(app)
    # Handle token refresh when using Manages Service Identity
    if "UID%3D" not in app.config["SQLALCHEMY_DATABASE_URI"]:
        from sqlalchemy import event
        @event.listens_for(db.engine, "do_connect")
        def provide_token(dialect, conn_rec, cargs, cparams):
            # remove the "Trusted_Connection" parameter that SQLAlchemy adds
            cargs[0] = cargs[0].replace(";Trusted_Connection=Yes", "")
            # create token credential
            raw_token = AccountToken("https://database.windows.net/.default").token.encode("utf-16-le")
            token_struct = struct.pack(f"<I{len(raw_token)}s", len(raw_token), raw_token)
            # apply it to keyword arguments
            cparams["attrs_before"] = {1256: token_struct}
            
    return db
app.db = get_db()

# Get all the defined SQLAlchemy models
import sys
import os
from glob import glob
import inspect
import importlib

app.db_models = []
path = "libs.sql.models"
for file in glob(f"{path.replace('.','/')}/*.py"):
    name = path + "." + os.path.splitext(os.path.basename(file))[0]
    module = importlib.import_module(name)
    for class_name, class_object in inspect.getmembers(sys.modules[name], lambda x: inspect.isclass(x) and (x.__module__ == name)):
        app.db_models.append(class_object)

# Check tables
tables = [model.__tablename__ for model in app.db_models]
databaseTable = app.db.engine.table_names(schema=os.environ.get("SQL_SCHEMA"))
check = all(item in databaseTable for item in tables) 

if check == False:
    from libs.sql.base import Base
    Base.metadata.create_all(app.db.engine)