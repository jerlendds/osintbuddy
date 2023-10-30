from celery import Celery
from app.core.config import settings

app = Celery("worker", broker=settings.CELERY_BROKER_URL, backend=settings.CELERY_BACKEND)  # 'redis://redis:6379/0' guest@redis// http://guest@redis:15672/api//

app.conf.task_routes = {
    "app.worker.run_proxy_fingerprint": "main-queue",
    "app.worker.get_cse_sources": "main-queue",
    "app.worker.get_cses_from_source": "main-queue",
    "app.worker.search_cses": "main-queue",
}
