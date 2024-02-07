from .db import session
from ..utils import hash_password
from ..schemas import UserCreate,  UserUpdate, PlatformConfigUser
from typing import List


# Add user to the database
@session
def add_user(cur, user: UserCreate):
    first_name = user.first_name
    last_name = user.last_name
    email = user.email
    phone = user.phone
    username = user.username
    password = user.password
    role_id = user.role_id
    credit = user.credit
    password = hash_password(password)
    cur.execute("INSERT INTO users(first_name, last_name, email, phone, username, password, role_id, credit) VALUES(%s, %s, %s, %s, %s, %s, %s, %s)",
                (first_name, last_name, email, phone, username, password, role_id, credit))    
    return True

# Add user default platform configs to the database
@session
def add_user_default_platform_configs(cur, user_id, default_platform_config):
    for platform_config in default_platform_config:
        platform_id = platform_config['id']
        character_limit = platform_config['character_limit']
        no_of_posts = platform_config['no_of_posts']
        hashtag_usage = platform_config['hashtag_usage']
        mention_usage = platform_config['mention_usage']
        emoji_usage = platform_config['emoji_usage']
        cur.execute("INSERT INTO user_platform_configs(user_id, platform_id, character_limit, no_of_posts, hashtag_usage, mention_usage, emoji_usage) VALUES(%s, %s, %s, %s, %s, %s, %s)",
                    (user_id, platform_id, character_limit, no_of_posts, hashtag_usage, mention_usage, emoji_usage))
    return True


# Get user from the database
@session
def get_user(cur, id):
    cur.execute("SELECT * FROM users WHERE id=%s", (id,))
    return cur.fetchone()


# Get user by email from the database
@session
def get_user_by_email(cur, email):
    cur.execute("SELECT * FROM users WHERE email=%s", (email,))
    return cur.fetchone()


# Get all users from the database
@session
def get_users(cur, skip, limit):
    cur.execute("SELECT * FROM users LIMIT %s OFFSET %s", (limit, skip))
    return cur.fetchall()


# Update user in the database
@session
def update_user(cur, user: UserUpdate):
    id = user.id
    first_name = user.first_name
    last_name = user.last_name
    email = user.email
    phone = user.phone
    username = user.username
    role_id = user.role_id
    cur.execute("UPDATE users SET first_name=%s, last_name=%s, email=%s, phone=%s, username=%s, role_id=%s WHERE id=%s",
                (first_name, last_name, email, phone, username, role_id, id))
    return True


# Delete user from the database
@session
def delete_user(cur, id):
    cur.execute("DELETE FROM users WHERE id=%s", (id,))
    return True


# Get user platform configs from the database
@session
def get_user_platform_configs_with_name(cur, user_id) -> PlatformConfigUser:
    cur.execute("""SELECT user_platform_configs.user_id,user_platform_configs.platform_id, platforms.name, user_platform_configs.character_limit,
                 user_platform_configs.no_of_posts, user_platform_configs.hashtag_usage, user_platform_configs.mention_usage, user_platform_configs.emoji_usage 
                FROM user_platform_configs 
                JOIN platforms ON user_platform_configs.platform_id=platforms.id 
                WHERE user_platform_configs.user_id=%s""",
                (user_id,))
    return cur.fetchall()