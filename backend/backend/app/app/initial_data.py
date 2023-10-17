import logging

from app.db.init_db import init_db
from app.db.session import SessionLocal

logging.basicConfig(level=logging.INFO)
log = logging.getLogger(__name__)


def init() -> None:
    db = SessionLocal()
    return init_db(db)


def main() -> None:
    try:
        log.info("Running initial data check...")
        init()
        log.info("Initial data check completed")
    except Exception as e:
        log.error(e)


if __name__ == "__main__":
    main()
