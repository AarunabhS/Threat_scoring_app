from sqlalchemy import create_engine, text
from sqlalchemy.exc import ProgrammingError
import os

db_url = "postgresql://postgres@localhost/postgres"
engine = create_engine(db_url)

with engine.connect() as conn:
    conn.execute(text("commit"))
    try:
        conn.execute(text("CREATE DATABASE threat_scoring"))
        print("Database created")
    except Exception as e:
        print(f"Database might already exist or error: {e}")
