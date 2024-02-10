from .database.models import Text
from .schemas import PlatformConfigBase
from typing import List
from .config import settings
from .instruction import instruction
from openai import OpenAI
import json


client = OpenAI(api_key=settings.openai_api_key)

def generate_social_media_posts(text_id: int, platforms_config: List[PlatformConfigBase], db) : 
    text = db.query(Text).filter(Text.id == text_id).first()
    user_input = f'"text": {text.content}\n"platform_configuratons": {platforms_config}'
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
    response = json.loads(completion.choices[0].message.content)
    return response