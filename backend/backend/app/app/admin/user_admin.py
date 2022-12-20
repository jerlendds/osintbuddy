from app.models import User
from app.admin.model import AuthModelAdmin


class UserAdmin(AuthModelAdmin, model=User):

    can_create = True
    can_edit = True
    can_delete = False
    can_view_details = True

    column_list = [User.id, User.email, User.full_name, User.created]
