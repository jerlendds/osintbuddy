from app.crud.base import CRUDBase
from app.models.ghdb import Dork_Categories
from app.schemas.ghdb import DorkCategoriesCreate, DorkCategoriesUpdate


class CRUDDorkCategories(CRUDBase[
    Dork_Categories,
    DorkCategoriesCreate,
    DorkCategoriesUpdate
]):
    pass


dork_categories = CRUDDorkCategories(Dork_Categories)
