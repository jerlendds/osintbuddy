from app.crud.base import CRUDBase
from app.models.search import Google_Search
from app.schemas.search import GoogleSearchCreate, GoogleSearchUpdate


class CRUDGoogleSearch(CRUDBase[
    Google_Search,
    GoogleSearchCreate,
    GoogleSearchUpdate
]):
    pass


google_search = CRUDGoogleSearch(Google_Search)
