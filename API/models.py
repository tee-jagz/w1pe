from pydantic import BaseModel


class User(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone: str
    username: str
    password: str
    role_id: int


class Role(BaseModel):
    name: str


class Post(BaseModel):
    content: str
    platform_id: int
    owner_id: int


class Text(BaseModel):
    title: str = None
    content: str
    owner_id: int


class Platform(BaseModel):
    name: str
    character_limit: int
    no_of_posts: int
    hashtag_usage: bool
    mention_usage: bool
    emoji_usage: bool