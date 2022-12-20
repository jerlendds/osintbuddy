import sys
import logging
from typing import Optional
from app.core.config import settings

# @todo: clean up messy `get_logger` function seen below
def get_sentry_logger():
    pass


def get_logger(
    logger_name: str,
    log_path: Optional[str] = None,
    formatter: Optional[logging.Formatter] = None,
    is_sentry: bool = False,
    is_celery: bool = False,
):
    """ "Setup file logger, see readme for configure the log viewing setup or feel free to use your own


    Args:
        logger_name (str): getLogger by name
        logpath (str): path to the directory where `{logger_name}.log` is stored
        formatter (Optional[logging.Formatter], optional) Defaults to "[%(levelname)s] %(asctime)s :: %(message)s", "%Y-%m-%d %H:%M:%S".
        is_sentry (bool, optional): Enable Sentry using DSN in .env. Defaults to False.
        is_celery (bool, optional): Correctly configures signals if using celery. Defaults to False.

    Returns:
       logging.Logger: returns your standard python logger
    """
    logger = logging.getLogger(logger_name)
    logger.setLevel(logging.DEBUG)
    log_format = logging.Formatter(
        "[%(levelname)s] %(asctime)s :: %(message)s", "%Y-%m-%d %H:%M:%S"
    )
    if formatter:
        log_format = formatter

    log_handler = logging.StreamHandler(sys.stdout)

    log_handler.setFormatter(log_format)
    logger.addHandler(log_handler)
    log_handler.setLevel(logging.DEBUG)
    logger.addHandler(log_handler)
    if is_sentry:
        import sentry_sdk
        from sentry_sdk.integrations.logging import LoggingIntegration

        sentry_logging = LoggingIntegration(
            level=logging.INFO,  # Capture info and above as breadcrumbs
            event_level=logging.ERROR,  # Send errors as events
        )
        sentry_sdk.init(
            dsn=settings.SENTRY_DSN, integrations=[sentry_logging], sample_rate=0.05
        )
    if is_celery:
        from celery.signals import after_setup_logger, after_setup_task_logger

        after_setup_logger.connect(logger)
        after_setup_task_logger.connect(logger)
    return logger
