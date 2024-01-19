import inspect, time, importlib, imp

from sqlalchemy.orm import Session
from osintbuddy.plugins import EntityRegistry, load_plugin_source
import requests


from app import crud, schemas
from app.core.logger import get_logger
# make sure all SQL Alchemy models are imported (app.db.base) before initializing DB
from .base import *  # noqa

log = get_logger(__name__)

core_ob_url = 'https://raw.githubusercontent.com/jerlendds/osintbuddy-core-plugins/develop/plugins/'
core_plugins = [
    'google_cse_result',
    'google_cse_search',
    'dns',
    'google_cache_result',
    'google_cache_search',
    'google_result',
    'google_search',
    'ip',
    'ip_geolocation',
    'subdomain',
    'telegram_cse_search',
    'url',
    'username',
    'username_profile',
    'website',
    'whois'
]


def init_db(db: Session) -> None:
    entity_count = crud.entities.count_all(db)[0][0]
    if entity_count < 14:
        mod = imp.new_module('core_entities')
        print('1 mod', mod, dir(mod))
        for file_endpoint in core_plugins:
            log.info(f"Loading core plugin/entity: {file_endpoint}")
            try:
                resp = requests.get(core_ob_url + file_endpoint + ".py")
                source_file = open(f"/app/app/plugins/{file_endpoint}.py", "w+")
                source_file.write(resp.text)
                source_file.close()
            except requests.exceptions.ConnectionError as e:
                # TODO: Use tenacity lib retry logic instead
                log.error("Error loading core plugin! ", e)
        EntityRegistry.discover_plugins()
        for e in EntityRegistry.entities:
            log.info(f"Saving core plugin/entity: {file_endpoint}")
            obj_in = schemas.EntityCreate(
                label=e.label,
                author=e.author,
                description=e.description,
                source=inspect.getsource(e),
                is_favorite=False
            )
            entity_obj = crud.entities.get_by_label(db=db, label=obj_in.label)
            if entity_obj:
                crud.entities.update(db, db_obj=entity_obj, obj_in=obj_in.model_dump())
            else:
                crud.entities.create(db, obj_in=obj_in)

    return {
        "status": "success",
        "service": "[Entities: Create]",
        "message": f"{len(EntityRegistry.entities)} initial entities (plugins) loaded",
    }
