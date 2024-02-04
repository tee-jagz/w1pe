from .schemas import PlatformConfigBase

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

default_platform_configs = [PlatformConfigBase(**twitter_config),
                            PlatformConfigBase(**instagram_config),
                            PlatformConfigBase(**facebook_config)]