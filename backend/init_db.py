import sys
import os

# Add backend root to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.session import engine, Base, SessionLocal
from app.models.models import User, UserRole
from app.core.security import get_password_hash
from app.core.config import settings

def init_db():
    print(f"Connecting to Database: {settings.DATABASE_URL.split('@')[-1] if '@' in settings.DATABASE_URL else settings.DATABASE_URL}")
    print("Creating tables in PostgreSQL database...")
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

    except Exception as e:
        print(f"❌ Error initializing database: {e}")
        sys.exit(1)

if __name__ == "__main__":
    init_db()
