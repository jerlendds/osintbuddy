from typing import List

from app.crud.base import CRUDBase, ModelType
from app.models.projects import Projects
from app.schemas.search import ProjectCreate, ProjectUpdate
from sqlalchemy.orm import Session


class CRUDProjects(CRUDBase[
    Projects,
    ProjectCreate,
    ProjectUpdate
]):
    def get_multi_by_user(
        self, db: Session, *, skip: int = 0, limit: int = 100
    ) -> List[ModelType]:
        return db.query(self.model).offset(skip).limit(limit).all()


projects = CRUDProjects(Projects)
