import socket
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from app.core.config import settings

db_url = settings.DATABASE_URL

# Automatic fallback for local Windows execution outside Docker container:
# If 'db' hostname cannot be resolved, fallback to 'localhost'
if "@db:" in db_url or "@db/" in db_url:
    try:
        socket.gethostbyname("db")
    except Exception:
        db_url = db_url.replace("@db:", "@localhost:").replace("@db/", "@localhost/")

# Create engine with connection pooling and pre-ping healthcheck
engine = create_engine(
    db_url,
    pool_pre_ping=True,
    echo=False
)

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Base(DeclarativeBase):
    pass

# Dependency to get DB session per request
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
