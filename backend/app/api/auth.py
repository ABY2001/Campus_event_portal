from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.models import User, StudentProfile, UserRole
from app.schemas.schemas import UserRegisterRequest, UserLoginRequest, TokenResponse, UserResponse
from app.core.security import get_password_hash, verify_password, create_access_token, decode_token

router = APIRouter(prefix="/auth", tags=["Authentication"])
security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)) -> User:
    token = credentials.credentials
    payload = decode_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user_id = payload.get("sub")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user account")
    return user

def require_admin(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Action restricted to administrators only"
        )
    return current_user

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(user_in: UserRegisterRequest, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user_in.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User with this email already exists")

    new_user = User(
        email=user_in.email,
        password_hash=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        role=UserRole.STUDENT
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    profile = StudentProfile(
        user_id=new_user.id,
        student_id_number=user_in.student_id_number,
        department=user_in.department,
        year_of_study=user_in.year_of_study,
        phone_number=user_in.phone_number
    )
    db.add(profile)
    db.commit()

    token = create_access_token(subject=str(new_user.id), role=new_user.role.value)
    return TokenResponse(
        access_token=token,
        user_id=str(new_user.id),
        email=new_user.email,
        full_name=new_user.full_name,
        role=new_user.role
    )

@router.post("/create-admin", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_custom_admin(
    admin_in: UserRegisterRequest,
    current_admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    existing_user = db.query(User).filter(User.email == admin_in.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User with this email already exists")

    new_admin = User(
        email=admin_in.email,
        password_hash=get_password_hash(admin_in.password),
        full_name=admin_in.full_name,
        role=UserRole.ADMIN
    )
    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)
    return new_admin

@router.post("/login", response_model=TokenResponse)
def login(credentials: UserLoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    token = create_access_token(subject=str(user.id), role=user.role.value)
    return TokenResponse(
        access_token=token,
        user_id=str(user.id),
        email=user.email,
        full_name=user.full_name,
        role=user.role
    )

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
