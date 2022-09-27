import logging
from libs.flask import app
import azure.functions as func
from urllib.parse import urlparse

from libs.flask.identity import whoami

@app.wsgi_handler()
async def main(req: func.HttpRequest, context: func.Context) -> func.HttpResponse:    
    prefix = urlparse(req.url).path.removesuffix("/"+str(req.route_params.get("flask_route")))

    @app.route(f"{prefix}/test")
    def test():
        logging.error(whoami())
        return "OK", 201
        
    for model in app.db_models:
        app.jsonapi.create_api(
            model,
            url_prefix=prefix, 
            methods=['GET','POST','DELETE','PATCH'],
            preprocessors=app.permission.api_preprocessors,
            allow_to_many_replacement = True,
            allow_delete_from_to_many_relationships = True,
            page_size = 100,
            max_page_size = 2000,
        )
    logging.warning(app.url_map)

# from ..libs.flask.authorization import (
#     add_policy as abac_add_policy,
#     delete_policy as abac_delete_policy
# )
# add_policy(
#     name="AllowAllForDevOps",
#     rules={
#         "subject": [
#             {"$.groups": {"condition": "AnyIn", "values": ["1d20defe-43a7-4831-93e0-68ada1afc646"]}},
#         ],
#         "resource": {"$.name": {"condition": "RegexMatch", "value": ".*"}},
#         "action": [
#             {"$.method": {"condition": "RegexMatch", "value": ".*"}},
#         ],
#         "context": {}
#     }
# )