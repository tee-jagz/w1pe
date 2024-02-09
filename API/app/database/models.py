from .db import Base
from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, Sequence
from ..config import settings
from datetime import datetime


now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, index=True, nullable=False, unique=True, )
    name = Column(String, unique=True, index=True, nullable=False)
    description = Column(String, nullable=True)
    created_at = Column(String, nullable=False, default=now)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, nullable=False, unique=True)
    first_name = Column(String)
    last_name = Column(String)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    password = Column(String, nullable=False)
    credit = Column(Integer, default=settings.start_credit, nullable=False)
    role_id = Column(Integer, ForeignKey("roles.id"), nullable=False)
    created_at = Column(String, nullable=False, default=now)


class Texts(Base):
    __tablename__ = "texts"

    id = Column(Integer, primary_key=True, index=True, nullable=False, unique=True)
    title = Column(String, nullable=False)
    content = Column(String, nullable=False)
    posted = Column(Boolean, nullable=False, default=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, )
    created_at = Column(String, nullable=False, default=now)


class Platforms(Base):
    __tablename__ = "platforms"

    id = Column(Integer, primary_key=True, index=True, nullable=False, unique=True)
    name = Column(String, nullable=False, unique=True, index=True)
    character_limit = Column(Integer, nullable=False)
    no_of_posts = Column(Integer, nullable=False)
    hashtag_usage = Column(Boolean, nullable=False)
    mention_usage = Column(Boolean, nullable=False)
    emoji_usage = Column(Boolean, nullable=False)
    created_at = Column(String, nullable=False, default=now)


class UserPlatformConfigs(Base):
    __tablename__ = "user_platform_configs"

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True, nullable=False, )
    platform_id = Column(Integer, ForeignKey("platforms.id"), primary_key=True, nullable=False, )
    character_limit = Column(Integer, nullable=False)
    no_of_posts = Column(Integer, nullable=False)
    hashtag_usage = Column(Boolean, nullable=False)
    mention_usage = Column(Boolean, nullable=False)
    emoji_usage = Column(Boolean, nullable=False)
    created_at = Column(String, nullable=False, default=now)


class Posts(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True, nullable=False, unique=True)
    content = Column(String, nullable=False)
    text_id = Column(Integer, ForeignKey("texts.id"), nullable=False, )
    platform_id = Column(Integer, ForeignKey("platforms.id"), nullable=False, )
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, )
    posted = Column(Boolean, nullable=False, default=False)
    created_at = Column(String, nullable=False, default=now)