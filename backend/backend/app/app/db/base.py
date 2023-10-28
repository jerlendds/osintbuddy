# Import all the models, so that Base has them before being
# imported by Alembic!

from app.db.base_class import Base  # noqa
from app.models import (  # noqa
    User,
    Graphs,
    Proxy_Type,
    Proxies,
    Entities,
    Scan_Machines,
    Scans,
)
