# Import all the models, so that Base has them before being
# imported by Alembic
from app.db.base_class import Base  # noqa
from app.models.item import Item  # noqa
from app.models.user import User  # noqa
from app.models.project import Project  # noqa
from app.models.search import Search  # noqa
from app.models.user_search import UserSearch  # noqa
from app.models.search_category import SearchCategory  # noqa
from app.models.cse import Cse  # noqa
from app.models.search_result import SearchResult  # noqa
