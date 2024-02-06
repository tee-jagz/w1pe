
from .db import get_text
from .platform_config import default_platform_configs
from .schemas import PlatformConfigBase
from typing import List
from .config import settings
from .instruction import instruction
from openai import OpenAI
import json


client = OpenAI(api_key=settings.openai_api_key)

def generate_social_media_posts(text_id: int, platforms_config: List[PlatformConfigBase] = default_platform_configs) :
    text = get_text(text_id)
    text = text["content"]
    user_input = f'"text": {text}\n"platform_configuratons": {platforms_config}'
    completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": f"{instruction} {user_input}",
            }
        ],
        model=settings.oai_model_name,
        response_format={"type": "json_object"},
    )
    return json.loads(completion.choices[0].message.content)