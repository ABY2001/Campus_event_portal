from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Optional
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "Campus Event Management Portal"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # PostgreSQL Database URL
    # Format: postgresql://user:password@host:port/dbname
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "postgresql://postgres:postgres@localhost:5432/campus_db"
    )
    
    # JWT Authentication
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super_secret_campus_key_change_in_production_12345")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    # CORS Origins
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:80",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "*"
    ]
    
    # Upload directory for event banners
    UPLOAD_DIR: str = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads")

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()

os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
