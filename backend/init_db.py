import sys
import os
import time

# Add backend root to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.session import engine, Base, SessionLocal
from app.models.models import User, UserRole
from app.core.security import get_password_hash
from app.core.config import settings

def init_db(max_retries: int = 5, retry_interval: int = 3):
    print(f"Connecting to Database: {settings.DATABASE_URL.split('@')[-1] if '@' in settings.DATABASE_URL else settings.DATABASE_URL}")
    print("Creating tables in PostgreSQL database...")

    for attempt in range(1, max_retries + 1):
        try:
            Base.metadata.create_all(bind=engine)
            print("✅ Database tables created successfully!")
            
            # Seed initial default admin if no admin exists
            db = SessionLocal()
            try:
                admin_user = db.query(User).filter(User.role == UserRole.ADMIN).first()
                if not admin_user:
                    default_admin_email = "admin@campus.edu"
                    default_admin_pass = "Admin123!"
                    print(f"🌱 Seeding initial administrator account: {default_admin_email}")
                    new_admin = User(
                        email=default_admin_email,
                        password_hash=get_password_hash(default_admin_pass),
                        full_name="System Administrator",
                        role=UserRole.ADMIN
                    )
                    db.add(new_admin)
                    db.commit()
                    print(f"✅ Default Admin account created! Email: {default_admin_email} | Password: {default_admin_pass}")
                else:
                    print("ℹ️ Admin account already exists in database.")
            finally:
                db.close()
            return

        except Exception as e:
            if attempt < max_retries:
                print(f"⚠️ Attempt {attempt}/{max_retries} failed to connect to PostgreSQL ({e}). Retrying in {retry_interval}s...")
                time.sleep(retry_interval)
            else:
                print(f"❌ Error initializing database after {max_retries} attempts: {e}")
                print("💡 Tip: Make sure your PostgreSQL container or service is running via 'docker compose up db'.")
                sys.exit(1)

if __name__ == "__main__":
    init_db()
