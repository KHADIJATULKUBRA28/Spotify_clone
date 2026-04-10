"""
Recently played router - recently played songs endpoints
"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from database import get_db
from app.models import User
from app.schemas import RecentlyPlayedListResponse, RecentlyPlayedResponse
from app.auth import get_current_active_user
from app.services.song_service import SongService

router = APIRouter(prefix="/api/recently-played", tags=["recently-played"])


@router.get("", response_model=RecentlyPlayedListResponse)
async def get_recently_played(
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get user's recently played songs"""
    recently_played = SongService.get_recently_played(db, current_user.id, limit=limit)
    return RecentlyPlayedListResponse(
        items=[RecentlyPlayedResponse.model_validate(rp) for rp in recently_played],
        total=len(recently_played)
    )


@router.post("/{song_id}")
async def add_to_recently_played(
    song_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Add song to recently played"""
    SongService.add_to_recently_played(db, current_user.id, song_id)
    return {"message": "Song added to recently played"}
