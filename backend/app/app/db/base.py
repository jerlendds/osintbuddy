# Import all the models, so that Base has them before being
# imported by Alembic
from app.db.base_class import Base  # noqa
from app.models.user import User  # noqa
from app.models.cse import Cse  # noqa

from app.models.search_category import Search_Category  # noqa
from app.models.search import Search  # noqa
from app.models.user_search import User_Search  # noqa
from app.models.search_result import Search_Result  # noqa
