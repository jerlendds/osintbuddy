import datetime
from typing import Any, Dict, Optional, Union

from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate


class CRUDUser(CRUDBase[User, UserCreate, UserUpdate]):
    def get_by_email(self, db: Session, *, email: str) -> Optional[User]:
        return db.query(User).filter(User.email == email).first()

    # get by casdoor account id
    def get_by_cid(self, db: Session, *, cid: int) -> User | None:
        return db.query(User).filter(User.cid == cid).first()

    # def get_or_create_cuser(self, db: Session, *, cuser: dict = {}):
    #     user = db.query(self.model).filter(User.cid == cuser.get("name")).first()
    #     if user:
    #         return user
    #     else:
    #         user = self.model(**kwargs)
    #         session.add(user)
    #         session.commit()
    #         return user
                

user = CRUDUser(User)
