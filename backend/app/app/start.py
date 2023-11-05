import os
import sys
import time
import uvicorn
from colorama import just_fix_windows_console
from termcolor import colored
from pyfiglet import figlet_format
just_fix_windows_console()
from app.core.config import settings
# from osintbuddy.ascii import ...  # TODO: add fancy ascii logo on startup and simplify text 
# 9223372036854775807
# 1000000000000000000
# 6776263578034402712
# 211758236813575084
# 54210108624275221700
# 13552527156068805425
# 2123376744927742546
# 167178000014870056761381858022369530297
# 999999999999999999999999999999999999999
def print_startup_message():
    print(colored("Introducing...", color="red", attrs=["bold"]))
    time.sleep(1)
    for line in figlet_format("the", font="small").split('\n'):
        print(colored(line, color="blue"))
    for line in figlet_format("OSINTBuddy", font='doom',).split('\n'):
        print(colored(line, color="blue", attrs=["bold"]))
    for line in figlet_format("                                 project", font="small").split('\n'):
        print(colored(line, color="blue"))
    print(
        colored("Created by:", color="red"),
        colored("jerlendds\n\n\n", color="red", attrs=["bold", "underline"]),
    )


def main():
    print_startup_message()
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=80,
        loop="asyncio",
        reload=True,
        workers=6,
        headers=[("server", "app")],
        log_level=settings.BACKEND_LOG_LEVEL
    )


if __name__ == "__main__":
    main()
