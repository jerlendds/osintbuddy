from celery import Celery

celery_app = Celery("worker", backend="rpc://", broker="amqp://guest@queue//")  # guest@queue// http://guest@queue:15672/api//

celery_app.conf.task_routes = {"app.worker.start_cse_crawl": "main-queue"}
