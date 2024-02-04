from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

# Initialize the settings class with the environment variables
class Settings(BaseSettings):
    openai_api_key:str
    database_name: str
    database_user: str
    database_password: str
    database_host: str
    database_port: int
    secret_key: str
    algorithm: str
    access_token_expire_minutes: int

settings = Settings()