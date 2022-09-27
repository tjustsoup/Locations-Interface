from py_abac.storage.sql import SQLStorage
from py_abac import PDP, Policy, AccessRequest
from . import app
from .identity import whoami
from functools import wraps
from flask import abort
from libs.flask import app

class DynObj:
    None
    
app.permission = DynObj()
def is_allowed(resource, action, context={}):
    storage = SQLStorage(scoped_session=app.db.session)
    return PDP(storage).is_allowed(
        AccessRequest.from_json({
            "subject": {
                "id": "",
                "attributes": whoami()
            },
            "resource": {
                "id": "",
                "attributes": resource
            },
            "action": {
                "id": "",
                "attributes": action
            },
            "context": context
        })
    )
def check(resource, action, context={}):
    if not is_allowed(resource, action, context):
        abort(403)
app.permission.check = check
    
# Wrapper function to simplify permission checks
def can(resource, action, context={}):
    def wrapper(function):
        @wraps(function)
        def inner(*args, **kwargs):
            check(resource, action, context)
            return function(*args, **kwargs)
        return inner
    return wrapper
app.permission.gatekeeper = can

def add_policy(name:str, rules: dict, description:str = "", effect:str = "allow", targets:dict = {}, priority:int = 0):
    storage = SQLStorage(scoped_session=app.db.session)
    policy = Policy.from_json({
        "uid": name,
        "description": description,
        "effect": effect,
        "rules": rules,
        "targets": targets,
        "priority": priority
    })
    storage.add(policy)

def delete_policy(name:str):
    storage = SQLStorage(scoped_session=app.db.session)
    storage.delete(name)
    storage.session.commit()