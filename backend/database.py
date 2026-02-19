from sqlmodel import create_engine, Session, SQLModel
from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    database_url: str = "postgresql://postgres@localhost/threat_scoring"

    class Config:
        env_file = os.path.join(os.path.dirname(__file__), ".env")

settings = Settings()

engine = create_engine(settings.database_url, echo=True)

def init_db():
    try:
        SQLModel.metadata.create_all(engine)
    except Exception as e:
        print(f"Database initialization warning: {e}")

def get_session():
    with Session(engine) as session:
        yield session
