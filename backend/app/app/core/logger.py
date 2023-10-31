import sys
import logging
from typing import Optional


def get_logger(
    name: str,
    formatter: Optional[logging.Formatter] = None,
) -> logging.Logger:
    """ Setup app logger

    Args:
        logger_name (str): getLogger by name
        formatter (Optional[logging.Formatter], optional) Defaults to "[%(levelname)s] %(asctime)s :: %(message)s", "%Y-%m-%d %H:%M:%S".

    Returns:
        logging.Logger: returns your standard python logger
    """
    logger = logging.getLogger(name)
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

    return logger
