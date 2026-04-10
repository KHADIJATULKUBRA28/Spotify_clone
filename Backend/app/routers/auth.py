"""
Authentication router - login, signup, and token endpoints
"""
from datetime import timedelta
from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session

from database import get_db
from config import get_settings
from app.schemas import LoginRequest, UserCreate, TokenResponse, UserResponse
from app.auth import AuthService
from app.services.user_service import UserService

router = APIRouter(prefix="/api/auth", tags=["authentication"])
settings = get_settings()


@router.post("/signup", response_model=TokenResponse)
async def signup(
    user_create: UserCreate,
    db: Session = Depends(get_db)
):
    """Create a new user account"""
    # Check if user already exists
    existing_user = UserService.get_user_by_email(db, user_create.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    existing_username = UserService.get_user_by_username(db, user_create.username)
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )

    # Create user
    user = UserService.create_user(db, user_create)

    # Generate token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = AuthService.create_access_token(
        data={"sub": user.email},
        expires_delta=access_token_expires
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse.model_validate(user)
    }


@router.post("/login", response_model=TokenResponse)
async def login(
    login_request: LoginRequest,
    db: Session = Depends(get_db)
):
    """Login with email and password"""
    user = UserService.get_user_by_email(db, login_request.email)

    if not user or not AuthService.verify_password(login_request.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is inactive"
        )

    # Generate token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = AuthService.create_access_token(
        data={"sub": user.email},
        expires_delta=access_token_expires
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse.model_validate(user)
    }


@router.post("/refresh")
async def refresh_token(
    credentials_bearer: str = None
):
    """Refresh access token"""
    # This is a simplified version. In production, implement proper refresh token logic
    if not credentials_bearer:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No token provided"
        )

    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Refresh token endpoint to be implemented"
    )
