from .schemas import PlatformConfigCreate

twitter_config = {
    "name": "Twitter",
    "character_limit": 280
}
instagram_config = {
    "name": "Instagram",
    "character_limit": 80
}
facebook_config = {
    "name": "Facebook",
    "character_limit": 600
}

default_platform_configs = [PlatformConfigCreate(**twitter_config),
                            PlatformConfigCreate(**instagram_config),
                            PlatformConfigCreate(**facebook_config)]