import osintbuddy
from app import crud, schemas, models
from app.core.logger import get_logger

from termcolor import colored
from pyfiglet import figlet_format

print(
    colored(figlet_format("osintbuddy py >", font='smslant',), color="green"),
    colored("Created by jerlendds", color="blue"),
    colored("""
###############################################################################
# The following imports and variables have been included in your current shell:
###############################################################################
import osintbuddy
from app import crud, schemas, models
""", color="green"))
