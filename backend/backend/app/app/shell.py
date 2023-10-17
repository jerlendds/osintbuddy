from app import crud, schemas, models
from app.core.logger import get_logger

log = get_logger("pyshell")

from termcolor import colored, COLORS
from pyfiglet import figlet_format

print(
  colored(figlet_format("OSINTBuddy", font='doom'), color="blue"),
  colored("Created by", color="green"), colored("jerlendds", color="cyan")
)
print(
  colored(figlet_format("pyshell >", font='smslant'), color="green"),
  colored("""
# The following imports and variables have been included in your current shell:""", color="green"), colored("""
from app import crud, schemas, models
from app.core.logger import get_logger

log = get_logger("pyshell")
""", color="magenta")
)
