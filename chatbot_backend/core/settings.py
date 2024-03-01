import tomllib
from functools import cached_property
from pathlib import Path
from typing import Literal
import os
from pydantic import AnyHttpUrl, EmailStr, PostgresDsn, computed_field
from pydantic_settings import BaseSettings, SettingsConfigDict

PROJECT_DIR = Path(__file__).parent.parent.parent


class Settings(BaseSettings):
    # CORE SETTINGS
    SECRET_KEY: str = os.getenv("SECRET_KEY") 
    ENVIRONMENT: Literal["DEV", "PYTEST", "STG", "PRD"] = "DEV"
    SECURITY_BCRYPT_ROUNDS: int = 12
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 11520  # 8 days
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 40320  # 28 days
    BACKEND_CORS_ORIGINS: list[AnyHttpUrl] = []
    ALLOWED_HOSTS: list[str] = ["*"]
    OPENAI_API_KEY: str =  os.getenv("OPENAI_API_KEY") 

    model_config = SettingsConfigDict(
        env_file=f"{PROJECT_DIR}/.env", case_sensitive=False
    )

settings: Settings = Settings()

