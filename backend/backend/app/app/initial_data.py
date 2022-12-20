import logging
from tkinter import E

from app.db.init_db import init_db
from app.db.session import SessionLocal

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def init() -> None:
    db = SessionLocal()
    return init_db(db)


def main() -> None:
    try:
        logger.info("Running initial data check...")
        init()
        logger.info("Initial data check completed")
    except Exception as e:
        print(e)


if __name__ == "__main__":
    main()
