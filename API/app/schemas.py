from pydantic import BaseModel, EmailStr, validator
from typing import Optional
from .config import settings


class UserBase(BaseModel):
    id: int
    username: str
    role_id: int

    class Config:
        from_attributes = True


class UserCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    username: str
    password: str
    phone: str
    role_id: Optional[int] = 1
    credit: Optional[int] = settings.start_credit

    # Validate password to have a minimum of 6 characters with at least one uppercase letter, one lowercase letter, one number, and one special character
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 6:
            raise ValueError('Password must be at least 6 characters long')
        if not any(char.isupper() for char in v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not any(char.islower() for char in v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not any(char.isdigit() for char in v):
            raise ValueError('Password must contain at least one number')
        if not any(not char.isalnum() for char in v):
            raise ValueError('Password must contain at least one special character')
        return v
    
    # Validate username to have a between of 3 to 15 caracters with only _, ., and - as special characters allowed and no spaces
    @validator('username')
    def validate_username(cls, v):
        if len(v) < 3 or len(v) > 15:
            raise ValueError('Username must be between 3 and 15 characters long')
        if not v.isalnum() and not all(char in ['_', '.', '-'] for char in v):
            raise ValueError('Username can only contain letters, numbers, _, ., and -')
        return v
    
    class Config:
        from_attributes = True


class UserEmail(BaseModel):
    email: EmailStr
    
    
class UserUpdate(BaseModel):
    id: int
    first_name: Optional[str]
    last_name: Optional[str]
    email: Optional[EmailStr]
    phone: Optional[str]
    role_id: Optional[int]
    username: Optional[str]

    # Validate username to have a between of 3 to 15 caracters with only _, ., and - as special characters allowed and no spaces
    @validator('username')
    def validate_username(cls, v):
        if len(v) < 3 or len(v) > 15:
            raise ValueError('Username must be between 3 and 15 characters long')
        if not v.isalnum() and not all(char in ['_', '.', '-'] for char in v):
            raise ValueError('Username can only contain letters, numbers, _, ., and -')
        return v
    
    class Config:
        from_attributes = True


class UserOutput(UserBase):
    first_name: str
    last_name: str
    email: EmailStr
    phone: str
    credit: int


class UserOutputComplete(UserOutput):
    role_id: int
    username: str
    password: str


class RoleBase(BaseModel):
    name: str

    class Config:
        from_attributes = True


class RoleCreate(RoleBase):
    pass


class RoleOut(RoleBase):
    id: int


class PostBase(BaseModel):
    content: str
    posted: bool = False

    class Config:
        from_attributes = True


class PostCreate(PostBase):
    platform_id: int
    text_id: int
    user_id: int


class PostUpdate(PostBase):
    id: int


class PostOut(PostCreate):
    id: int


class TextBase(BaseModel):
    title: Optional[str]
    content: str
    user_id: int
    posted: bool

    class Config:
        from_attributes = True


class TextCreate(BaseModel):
    title: Optional[str]
    content: str
    posted: bool = False
    user_id: Optional[int] = None

    class Config:
        from_attributes = True


class TextOut(TextBase):
    id: int


class TextUpdate(BaseModel):
    id: int
    title: Optional[str]
    content: Optional[str]
    posted: Optional[bool]

    class Config:
        from_attributes = True


class PlatformConfigBase(BaseModel):
    name: str
    character_limit: int
    no_of_posts: Optional[int] = 2
    hashtag_usage: Optional[bool] = False
    mention_usage: Optional[bool] = False
    emoji_usage: Optional[bool] = False

    class Config:
        from_attributes = True


class PlatformConfigCreate(PlatformConfigBase):
    pass


class PlatformConfigPostCreate(PlatformConfigBase):
    platform_id: Optional[int] = None


class PlatformConfigDefaultOutput(PlatformConfigBase):
    id: int


class PlatformConfigUser(PlatformConfigBase):
    user_id: int
    platform_id: int


class LoginForm(BaseModel):
    email: EmailStr
    password: str

    class Config:
        from_attributes = True


class TokenData(BaseModel):
    id: int
    username: str
    role_id: int
    first_name: str
    last_name: str
    email: EmailStr
    credit: int

    class Config:
        from_attributes = True