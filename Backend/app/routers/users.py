"""
User router - user profile and management endpoints
"""
from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session

from database import get_db
from app.models import User
from app.schemas import UserResponse, UserUpdate, UserProfileResponse
from app.auth import get_current_active_user
from app.services.user_service import UserService

router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(
    current_user: User = Depends(get_current_active_user)
):
    """Get current user profile"""
    return UserResponse.model_validate(current_user)


@router.get("/profile/me", response_model=UserProfileResponse)
async def get_current_user_profile_extended(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get extended user profile with statistics"""
    profile = UserService.get_user_profile(db, current_user)
    return profile


@router.put("/me", response_model=UserResponse)
async def update_current_user(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update current user profile"""
    updated_user = UserService.update_user(db, current_user, user_update)
    return UserResponse.model_validate(updated_user)


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: int,
    db: Session = Depends(get_db)
):
    """Get user by ID"""
    user = UserService.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return UserResponse.model_validate(user)


@router.get("/{user_id}/profile", response_model=UserProfileResponse)
async def get_user_profile(
    user_id: int,
    db: Session = Depends(get_db)
):
    """Get user profile with statistics"""
    user = UserService.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    profile = UserService.get_user_profile(db, user)
    return profile
