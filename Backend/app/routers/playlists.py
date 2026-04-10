"""
Playlists router - playlist management endpoints
"""
from fastapi import APIRouter, HTTPException, status, Depends, Query
from sqlalchemy.orm import Session

from database import get_db
from app.models import User
from app.schemas import (
    PlaylistCreate, PlaylistResponse, PlaylistDetailResponse,
    PlaylistListResponse, AddSongToPlaylistRequest, PlaylistUpdate,
    SongResponse
)
from app.auth import get_current_active_user
from app.services.playlist_service import PlaylistService

router = APIRouter(prefix="/api/playlists", tags=["playlists"])


@router.get("", response_model=PlaylistListResponse)
async def get_user_playlists(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get current user's playlists"""
    playlists, total = PlaylistService.get_user_playlists(
        db, current_user.id, skip=skip, limit=limit
    )
    return PlaylistListResponse(
        total=total,
        page=skip // limit + 1,
        page_size=limit,
        items=[PlaylistResponse.model_validate(p) for p in playlists]
    )


@router.get("/public", response_model=PlaylistListResponse)
async def get_public_playlists(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Get public playlists"""
    playlists, total = PlaylistService.get_public_playlists(
        db, skip=skip, limit=limit
    )
    return PlaylistListResponse(
        total=total,
        page=skip // limit + 1,
        page_size=limit,
        items=[PlaylistResponse.model_validate(p) for p in playlists]
    )


@router.post("", response_model=PlaylistResponse)
async def create_playlist(
    playlist_create: PlaylistCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new playlist"""
    playlist = PlaylistService.create_playlist(
        db,
        user_id=current_user.id,
        name=playlist_create.name,
        description=playlist_create.description,
        is_public=playlist_create.is_public
    )
    return PlaylistResponse.model_validate(playlist)


@router.get("/{playlist_id}", response_model=PlaylistDetailResponse)
async def get_playlist(
    playlist_id: int,
    db: Session = Depends(get_db)
):
    """Get playlist details with songs"""
    playlist = PlaylistService.get_playlist_by_id(db, playlist_id)
    if not playlist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Playlist not found"
        )

    # Check if playlist is public or belongs to current user
    return PlaylistDetailResponse(
        **PlaylistResponse.model_validate(playlist).model_dump(),
        songs=[SongResponse.model_validate(song) for song in playlist.songs]
    )


@router.put("/{playlist_id}", response_model=PlaylistResponse)
async def update_playlist(
    playlist_id: int,
    playlist_update: PlaylistUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update playlist"""
    playlist = PlaylistService.get_playlist_by_id(db, playlist_id)
    if not playlist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Playlist not found"
        )

    if playlist.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this playlist"
        )

    updated_playlist = PlaylistService.update_playlist(
        db,
        playlist,
        name=playlist_update.name,
        description=playlist_update.description,
        is_public=playlist_update.is_public
    )
    return PlaylistResponse.model_validate(updated_playlist)


@router.delete("/{playlist_id}")
async def delete_playlist(
    playlist_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete playlist"""
    playlist = PlaylistService.get_playlist_by_id(db, playlist_id)
    if not playlist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Playlist not found"
        )

    if playlist.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this playlist"
        )

    PlaylistService.delete_playlist(db, playlist_id)
    return {"message": "Playlist deleted successfully"}


@router.post("/{playlist_id}/songs")
async def add_song_to_playlist(
    playlist_id: int,
    request: AddSongToPlaylistRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Add song to playlist"""
    playlist = PlaylistService.get_playlist_by_id(db, playlist_id)
    if not playlist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Playlist not found"
        )

    if playlist.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to modify this playlist"
        )

    success = PlaylistService.add_song_to_playlist(db, playlist_id, request.song_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to add song to playlist"
        )

    return {"message": "Song added to playlist"}


@router.delete("/{playlist_id}/songs/{song_id}")
async def remove_song_from_playlist(
    playlist_id: int,
    song_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Remove song from playlist"""
    playlist = PlaylistService.get_playlist_by_id(db, playlist_id)
    if not playlist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Playlist not found"
        )

    if playlist.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to modify this playlist"
        )

    success = PlaylistService.remove_song_from_playlist(db, playlist_id, song_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to remove song from playlist"
        )

    return {"message": "Song removed from playlist"}
