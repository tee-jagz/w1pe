from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# Hash password
def hash_password(password: str) -> str:
    return pwd_context.hash(password)





# def add_platform_config(platform_config: {str:str}) -> None:
#     keys = ["name", "character_limit", "no_of_posts", "hashtag_usage", "mention_usage", "emoji_usage"]
#     if not all(key in platform_config for key in keys):
#         raise Exception("Invalid platform config. Please check the keys")
#     platforms_config.append(platform_config)
    

# def get_platforms_config() -> str:
#     if len(platforms_config) == 0:
#         raise Exception("No platforms added. Please add platforms using add_platform_config()")
#     return json.dumps(platforms_config)

# def clear_platforms_config() -> None:
#     platforms_config.clear()