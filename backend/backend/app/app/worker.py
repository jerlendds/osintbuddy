from app.core.celery_app import app
from app.core.config import settings
from app.core.logger import get_logger


logger = get_logger(
    logger_name="titan",
    is_celery=True,
    is_sentry=bool(settings.SENTRY_DSN)
)


@app.task(acks_late=True)
def test_celery(msg: str = "success") -> dict:
    return {"status": "ok"}
