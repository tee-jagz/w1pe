from passlib.context import CryptContext
from typing import List
from .schemas import PlatformConfigUser, PlatformConfigBase

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# Hash password
def hash_password(password: str) -> str:
    return pwd_context.hash(password)


# Verify password
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


# Calculate sum of platform posts from list of platform configuration objects
def sum_of_platform_posts(platforms: List[PlatformConfigBase]) -> int:
    return sum([platform.no_of_posts for platform in platforms])


# Calculate sum of character limit from list of platform configuration objects
def sum_of_character_limit(platforms: List[PlatformConfigUser]) -> int:
    return sum([platform.character_limit * platform.no_of_posts for platform in platforms])