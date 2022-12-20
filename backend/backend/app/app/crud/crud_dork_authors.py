from app.crud.base import CRUDBase
from app.models.ghdb import Dork_Authors
from app.schemas.ghdb import DorkAuthorsCreate, DorkAuthorsUpdate


class CRUDDorkAuthors(CRUDBase[
    Dork_Authors,
    DorkAuthorsCreate,
    DorkAuthorsUpdate
]):
    pass


dork_authors = CRUDDorkAuthors(Dork_Authors)
