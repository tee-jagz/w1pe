from pydantic import BaseModel, EmailStr, validator
from typing import Optional


class UserBase(BaseModel):
    id: int
    username: str
    role_id: int


class UserCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    username: str
    password: str
    phone: str
    role_id: Optional[int]

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


class User(UserBase):
    first_name: str
    last_name: str
    email: EmailStr
    phone: str


class RoleBase(BaseModel):
    name: str


class RoleCreate(RoleBase):
    pass


class RoleOut(RoleBase):
    id: int

class PostBase(BaseModel):
    id: int
    content: str
    platform_id: int
    text_id: int
    owner_id: int


class PostCreate(BaseModel):
    content: str
    platform_id: int
    text_id: int
    owner_id: int


class PostOut(PostBase):
    pass


class TextBase(BaseModel):
    id: int
    title: Optional[str]
    content: str
    owner_id: int
    posted: bool


class TextCreate(BaseModel):
    title: Optional[str]
    content: str
    owner_id: int
    posted: bool = False


class TextOut(TextBase):
    pass


class Platform(BaseModel):
    name: str
    character_limit: int
    no_of_posts: int
    hashtag_usage: bool
    mention_usage: bool
    emoji_usage: bool