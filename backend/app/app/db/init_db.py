import sys, importlib
from time import sleep
from sqlalchemy.orm import Session
from osintbuddy import EntityRegistry, load_plugin_source
import requests


from app import crud, schemas
from app.core.logger import get_logger
# make sure all SQL Alchemy models are imported (app.db.base) before initializing DB
from .base import *  # noqa

log = get_logger(__name__)

core_ob_url = 'https://raw.githubusercontent.com/jerlendds/osintbuddy-core-plugins/develop/plugins/'
core_plugins = {
    'CSE Result': 'google_cse_result',
    'CSE Search': 'google_cse_search',
    'DNS': 'dns',
    'Google Cache Result': 'google_cache_result',
    'Google Cache Search': 'google_cache_search',
    'Google Result': 'google_result',
    'Google Search': 'google_search',
    'IP': 'ip',
    'IP Geolocation': 'ip_geolocation',
    'Subdomain': 'subdomain',
    'Telegram CSE Search': 'telegram_cse_search',
    'URL': 'url',
    'Username': 'username',
    'Username Profile': 'username_profile',
    'Website': 'website',
    'Whois': 'whois'
}


def load_initial_plugin(db, mod, code):
    plugin = EntityRegistry._get_plugin(mod)
    obj_in = schemas.EntityCreate(
        label=plugin.label,
        author=plugin.author,
        description=plugin.description,
        source=code,
        is_favorite=False
    )
    return crud.entities.create(db=db, obj_in=obj_in)


def init_db(db: Session) -> None:
    entity_count = crud.entities.count_all(db)[0][0]
    if entity_count < 14:
        for plugin_label, plugin_mod in core_plugins.items():
            log.info(f"Loading core plugin/entity: {plugin_label}")
            try:
                resp = requests.get(core_ob_url + plugin_mod + '.py')
                load_plugin_source(plugin_label, resp.text)
                load_initial_plugin(db=db, mod=plugin_mod, code=resp.text)
                sleep(1)
            except requests.exceptions.ConnectionError as e:
                # TODO: Use tenacity lib retry logic here
                log.error(e)
                resp = requests.get(core_ob_url + plugin_mod + '.py')
                load_plugin_source(plugin_label, resp.text)
                load_initial_plugin(db=db, label=plugin_label, mod=plugin_mod, code=resp.text)
                sleep(1)

    return {
        "status": "success",
        "service": "[Entities: Create]",
        "message": f"{len(EntityRegistry.entities)} initial entities (plugins) loaded",
    }
