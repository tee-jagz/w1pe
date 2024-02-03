from openai import OpenAI
import json
from ..instruction import instruction
from .config import settings
from .db import get_user

client = OpenAI(api_key=settings.openai_api_key)

platforms_config = []



def generate_social_media_posts(text: str, platforms_config: str) -> {str: [str]}:
    user_input = f'"text": {text}\n"platforms": {platforms_config}'
    completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": f"{instruction} {user_input}",
            }
        ],
        model="gpt-4-1106-preview",
        response_format={"type": "json_object"},
    )
    return json.loads(completion.choices[0].message.content)


def add_platform_config(platform_config: {str:str}) -> None:
    keys = ["name", "character_limit", "no_of_posts", "hashtag_usage", "mention_usage", "emoji_usage"]
    if not all(key in platform_config for key in keys):
        raise Exception("Invalid platform config. Please check the keys")
    platforms_config.append(platform_config)
    

def get_platforms_config() -> str:
    if len(platforms_config) == 0:
        raise Exception("No platforms added. Please add platforms using add_platform_config()")
    return json.dumps(platforms_config)

def clear_platforms_config() -> None:
    platforms_config.clear()