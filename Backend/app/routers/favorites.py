"""
Favorites router - favorite songs management endpoints
"""
from fastapi import APIRouter, HTTPException, status, Depends, Query
from sqlalchemy.orm import Session

from database import get_db
from app.models import User
from app.schemas import (
    FavoriteResponse, AddFavoriteRequest, SongResponse
)
from app.auth import get_current_active_user
from app.services.favorite_service import FavoriteService

router = APIRouter(prefix="/api/favorites", tags=["favorites"])


@router.get("", response_model=FavoriteResponse)
async def get_favorite_songs(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get user's favorite songs"""
    favorites, total = FavoriteService.get_user_favorites(
        db, current_user.id, skip=skip, limit=limit
    )
    return FavoriteResponse(
        songs=[SongResponse.model_validate(song) for song in favorites],
        total=total
    )


@router.post("")
async def add_favorite(
    request: AddFavoriteRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Add song to favorites"""
    success = FavoriteService.add_favorite(db, current_user.id, request.song_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to add song to favorites"
        )
    return {"message": "Song added to favorites"}


@router.delete("/{song_id}")
async def remove_favorite(
    song_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Remove song from favorites"""
    success = FavoriteService.remove_favorite(db, current_user.id, song_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to remove song from favorites"
        )
    return {"message": "Song removed from favorites"}


@router.get("/{song_id}/check")
async def check_favorite(
    song_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Check if song is in user's favorites"""
    is_favorite = FavoriteService.is_favorite(db, current_user.id, song_id)
    return {"is_favorite": is_favorite}
