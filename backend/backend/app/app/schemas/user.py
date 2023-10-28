from uuid import UUID
import datetime
from typing import Optional, List

from pydantic import BaseModel, EmailStr


class CasdoorUser(BaseModel):
    id: UUID
    name: str
    displayName: str
    createdTime: datetime.datetime
    updatedTime: datetime.datetime
    sub: UUID
    firstName: str
    lastName: str
    avatar: str
    avatarType: str
    permanentAvatar: str
    email: str
    emailVerified: bool
    phone: str
    countryCode: str
    region: str
    location: str
    bio: str
    language: str
    isOnline: bool
    isAdmin: bool
    isForbidden: bool
    isDeleted: bool
    owner: str = "org_ob"
    type: str = "normal-user"
    signupApplication: str = "application_ob"
    aud: List[str] = []
    exp: int
    nbf: int
    iat: int
    jti: str


# Shared properties
class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = True
    is_superuser: bool = False
    full_name: Optional[str] = None


# Properties to receive via API on creation
class UserCreate(UserBase):
    email: EmailStr
    full_name: str
    password: str
    username: str = ""


# Properties to receive via API on update
class UserUpdate(UserBase):
    hashed_password: Optional[str] = None


class UserInDBBase(UserBase):
    id: Optional[int] = None

    class Config:
        from_attributes = True


# Additional properties to return via API
class User(UserInDBBase):
    modified: datetime.datetime
    created: datetime.datetime


# Additional properties stored in DB
class UserInDB(UserInDBBase):
    hashed_password: str
    modified: datetime.datetime
    created: datetime.datetime
