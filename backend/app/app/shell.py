import osintbuddy as ob
from osintbuddy import load_local_plugins
from app import crud, schemas, models
from app.core.logger import get_logger
from app.db.session import SessionLocal

from termcolor import colored
from pyfiglet import figlet_format

db = SessionLocal()
entities = crud.entities.get_many(db, skip=0, limit=100)
load_local_plugins(entities, "plugins")

print(
    colored(figlet_format("osintbuddy py >", font='smslant',), color="green"),
    colored("Created by jerlendds", color="blue"),
    colored("""
###############################################################################
# The following imports and variables have been included in your current shell:
###############################################################################
import osintbuddy as ob
from osintbuddy import load_local_plugins
from app import crud, schemas, models
from app.db.session import SessionLocal
db = SessionLocal()
entities = crud.entities.get_many(db, skip=0, limit=100)
load_local_plugins(entities, 'plugins')
""", color="green"))
