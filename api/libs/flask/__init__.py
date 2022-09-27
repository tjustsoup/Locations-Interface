import logging
from flask import Flask, session as Session
app = Flask(__name__)

from sqlalchemy.orm import scoped_session

from .db import *
from .sessions import session
from .authorization import can
from .jsonapi import manager

# Wrapper function to simplify flask routing
from functools import wraps
import azure.functions as func
from urllib.parse import urlparse
def wsgi_handler():
    def wrapper(function):
        @wraps(function)
        async def inner(*args, **kwargs):
            prefix = urlparse(kwargs["req"].url).path.removesuffix("/"+str(kwargs["req"].route_params.get("flask_route")))
            routes_instantiated = False
            for route in app.url_map.iter_rules():
                if prefix in str(route):
                    routes_instantiated = True
                    break
            if not routes_instantiated:
                await function(*args, **kwargs)
            return func.WsgiMiddleware(app.wsgi_app).handle(kwargs["req"], kwargs["context"])
        return inner
    return wrapper
app.wsgi_handler = wsgi_handler

import traceback
from pandas import DataFrame
from libs.flask.identity import whoami
# from libs.flask.authorization import PermissionError
def stdOut_api():
    def wrapper(function):
        @wraps(function)
        def inner(*args, **kwargs):
            input = None
            output = {}
            try:
                input = function(*args, **kwargs)
                output["success"] = True
                code = 200
            # except PermissionError as e:
            #     output["error"] = {
            #         "code": type(e).__name__,
            #         "message": str(e)
            #     }
            #     identity = whoami()
            #     if "error" in identity.keys():
            #         output["error"]["reason"] = {
            #             "message": identity["error"]["message"]
            #         }
            #     code = 403
            except Exception as e:
                output["error"] = {
                    "code": type(e).__name__,
                    "message": str(e),
                    "reason": {
                        "message": "An unhandled exception occured.",
                        "stack": traceback.format_stack()
                    }
                }
                code = 500
                
            if input is None:
                pass
            elif isinstance(input,DataFrame):
                output = input.to_dict(orient="records")
            elif isinstance(input,dict):
                output = input
            elif isinstance(input,str):
                output["message"] = input
            else:
                output = input.__dict__
            return output, code
        return inner
    return wrapper

app.stdOut = {
    "api": stdOut_api
}

@app.errorhandler(403)
def internal_error(error):
    error = {
        "status": "403",
        "title": "Permission Error",
        "detail": "Requesting entity does not have permission perform the requested action."
    }
    identity = whoami()
    if "error" in identity.keys():
        error["reason"] = {
            "detail": identity["error"]["message"]
        }
    return {"errors":[error]}, 403