import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    SECRET_KEY: str = os.getenv("SECRET_KEY", "campushub-secret-key-default")

    # Define both so either attribute works
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///campushub.db")
    SQLALCHEMY_DATABASE_URI: str = os.getenv("DATABASE_URL", "sqlite:///campushub.db")
    SQLALCHEMY_TRACK_MODIFICATIONS: bool = False

    # SMTP; leave blank unless explicitly configured so local/dev can fall back safely
    SMTP_SERVER: str = os.getenv("SMTP_SERVER", "").strip()
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USER: str = os.getenv("SMTP_USER", "").strip()
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "").strip()

settings = Settings()