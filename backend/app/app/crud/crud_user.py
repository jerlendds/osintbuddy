from typing import  Optional

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
                

user = CRUDUser(User)
