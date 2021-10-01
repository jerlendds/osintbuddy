from typing import List

from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.user_search import User_Search
from app.schemas.user_search import UserSearch, UserSearchCreate, UserSearchUpdate, UserSearchBase


class CRUDUserSearch(CRUDBase[UserSearch, UserSearchCreate, UserSearchUpdate]):
    def create_with_owner(self, db: Session, *, obj_in: UserSearchCreate) -> UserSearch:
        obj_in_data = jsonable_encoder(obj_in)
        db_obj = self.model(**obj_in_data)  # noqa
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_user_search_history(self, db: Session, *, current_user_id: int) -> List[UserSearch]:
        query = db.query(self.model)\
                .filter(self.model.user_id == current_user_id).all()
        print(query)
        return query


user_search = CRUDUserSearch(User_Search)
