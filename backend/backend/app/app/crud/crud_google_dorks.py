from app.crud.base import CRUDBase
from app.models.ghdb import Google_Dorks
from app.schemas.ghdb import GoogleDorksCreate, GoogleDorksUpdate


class CRUDGoogleDorks(CRUDBase[
    Google_Dorks,
    GoogleDorksCreate,
    GoogleDorksUpdate
]):
    pass


google_dorks = CRUDGoogleDorks(Google_Dorks)
