from .crud_item import item
from .crud_user import user
from .crud_search import search
from .crud_user_search import user_search
from .crud_search_result import search_result
# For a new basic set of CRUD operations you could just do

# from .base import CRUDBase
# from app.models.item import Item
# from app.schemas.item import ItemCreate, ItemUpdate

# item = CRUDBase[Item, ItemCreate, ItemUpdate](Item)
