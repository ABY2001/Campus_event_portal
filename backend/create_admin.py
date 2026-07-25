import sys
import os
import argparse

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.session import SessionLocal
from app.models.models import User, UserRole
from app.core.security import get_password_hash

def create_admin(email: str, password: str, full_name: str):
    db = SessionLocal()
    try:
        existing = db.query(User).filter(User.email == email).first()
        if existing:
            if existing.role == UserRole.ADMIN:
                print(f"⚠️ User '{email}' is already an Administrator.")
                return
            existing.role = UserRole.ADMIN
            db.commit()
            print(f"✅ Promoted existing user '{email}' to Administrator!")
            return

        new_admin = User(
            email=email,
            password_hash=get_password_hash(password),
            full_name=full_name,
            role=UserRole.ADMIN
        )
        db.add(new_admin)
        db.commit()
        print(f"✅ Administrator created successfully!")
        print(f"   Email: {email}")
        print(f"   Name: {full_name}")

    except Exception as e:
        print(f"❌ Error creating admin: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Create or promote an Administrator account.")
    parser.add_argument("--email", required=True, help="Admin email address")
    parser.add_argument("--password", required=True, help="Admin password")
    parser.add_argument("--name", default="Campus Administrator", help="Admin full name")

    args = parser.parse_args()
    create_admin(args.email, args.password, args.name)
