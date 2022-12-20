from celery import Celery


app = Celery("worker")  # guest@redis// http://guest@redis:15672/api//
app.conf.result_backend = "redis://redis:6379/0"


app.conf.task_routes = {
    "app.worker.run_proxy_fingerprint": "main-queue",
    "app.worker.get_cse_sources": "main-queue",
    "app.worker.get_cses_from_source": "main-queue",
    "app.worker.search_cses": "main-queue",
}
