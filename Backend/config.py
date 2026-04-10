"""
Configuration management for the Spotify Clone application
"""
import os
from functools import lru_cache
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings"""
    
    # API
    API_TITLE: str = "Kannada Spotify Clone API"
    API_VERSION: str = "1.0.0"
    API_DESCRIPTION: str = "A full-stack music streaming application for Kannada songs"
    
    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "sqlite:///./spotify_clone.db"
    )
    
    # JWT Settings
    SECRET_KEY: str = os.getenv(
        "SECRET_KEY",
        "your-secret-key-change-in-production-with-strong-random-key"
    )
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    CORS_ORIGINS: list = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ]
    
    # File Upload
    UPLOAD_DIRECTORY: str = os.getenv("UPLOAD_DIRECTORY", "./uploads")
    MAX_UPLOAD_SIZE: int = 100 * 1024 * 1024  # 100MB
    ALLOWED_AUDIO_EXTENSIONS: list = ["mp3", "wav", "flac", "m4a", "aac"]
    ALLOWED_IMAGE_EXTENSIONS: list = ["jpg", "jpeg", "png", "gif", "webp"]
    
    # AWS S3 (Optional)
    USE_S3: bool = os.getenv("USE_S3", "false").lower() == "true"
    AWS_S3_BUCKET: str = os.getenv("AWS_S3_BUCKET", "")
    AWS_REGION: str = os.getenv("AWS_REGION", "us-east-1")
    
    # Streaming
    CHUNK_SIZE: int = 1024 * 1024  # 1MB chunks for streaming
    
    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """Get application settings (cached)"""
    return Settings()
