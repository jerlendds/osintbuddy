import socket
import requests
from app.core.celery_app import app
from app.core.config import settings
from app.core.logger import get_logger


logger = get_logger(name="titan")


@app.task(acks_late=True)
def test_celery(msg: str = "success") -> dict:
    return {"status": "ok"}


@app.task
def run_dynamic_task(funcname, funccode, *args, **kwargs):
    try:
        ns = {}
        code = compile(funccode, funcname, "exec")
        eval(code, ns, ns)
        logger.info("execute %r with args %r, %r", funcname, args, kwargs)
        return ns["task"](*args, **kwargs)
    except IOError:
        logger.error("Error loading the dynamic function from text %s", funcname)
