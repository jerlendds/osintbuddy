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


class UserBase(BaseModel):
    name: str
    username: Optional[str] = ""
    email: Optional[str] = ""
    avatar: Optional[str] = ""
    phone: Optional[str] = ""
    display_name: Optional[str] = ""
    first_name: Optional[str] = ""
    last_name: Optional[str] = ""


class UserUpdate(UserBase):
    hashed_password: Optional[str] = None


class UserCreate(UserBase):
    is_admin: bool
    created_time: datetime.datetime
    updated_time: datetime.datetime

    class Config:
        from_attributes = True


class User(UserCreate):
    uuid: UUID


class UserInDBBase(UserCreate):
    is_admin: bool
    created_time: datetime.datetime
    updated_time: datetime.datetime
    cid: UUID

    class Config:
        from_attributes = True


class UserInDB(UserInDBBase):
    id: Optional[int] = None
    
    is_deleted: bool
    is_forbidden: bool
    is_online: bool
    email_verified: bool
