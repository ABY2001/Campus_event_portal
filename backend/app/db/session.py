from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from app.core.config import settings

# Create engine with connection pooling
engine = create_engine(
    settings.DATABASE_URL,
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
