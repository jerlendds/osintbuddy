from uuid import UUID
import datetime
from typing import Optional, List

from pydantic import BaseModel, EmailStr


class CasdoorUser(BaseModel):
    owner: str = "org_ob"
    type: str = "normal-user"
    signupApplication: str = "application_ob"

    id: UUID
    sub: Optional[UUID] = None
    exp: Optional[int] = None
    nbf: Optional[int] = None
    iat: Optional[int] = None
    jti: Optional[str] = None
    aud: List[str] = None

    avatar: Optional[str]
    avatarType: Optional[str]
    permanentAvatar: Optional[str]
    firstName: Optional[str] = None
    lastName: Optional[str] = None

    name: str
    displayName: str
    email: str
    emailVerified: bool
    phone: Optional[str]
    countryCode: Optional[str]
    region: Optional[str]
    location: Optional[str]
    bio: Optional[str]
    language: Optional[str] = "en"

    isOnline: Optional[bool] = False
    isAdmin: Optional[bool] = False
    isForbidden: Optional[bool] = False
    isDeleted: Optional[bool] = False
    updatedTime: datetime.datetime
    createdTime: datetime.datetime


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
