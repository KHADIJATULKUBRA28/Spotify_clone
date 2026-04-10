"""
Songs router - song management and streaming endpoints
"""
from fastapi import APIRouter, HTTPException, status, Depends, Query, File, UploadFile
from fastapi.responses import FileResponse, StreamingResponse
from sqlalchemy.orm import Session
import os
import shutil
from pathlib import Path

from database import get_db
from config import get_settings
from app.models import User
from app.schemas import SongCreate, SongResponse, SongDetailResponse, SongListResponse, FileUploadResponse
from app.auth import get_current_active_user
from app.services.song_service import SongService

router = APIRouter(prefix="/api/songs", tags=["songs"])
settings = get_settings()

# Ensure upload directory exists
Path(settings.UPLOAD_DIRECTORY).mkdir(parents=True, exist_ok=True)


@router.get("", response_model=SongListResponse)
async def get_songs(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    sort_by: str = Query("created_at", regex="^(created_at|play_count|title)$"),
    order: str = Query("desc", regex="^(asc|desc)$"),
    db: Session = Depends(get_db)
):
    """Get all songs with pagination and sorting"""
    songs, total = SongService.get_all_songs(db, skip=skip, limit=limit, sort_by=sort_by, order=order)
    return SongListResponse(
        total=total,
        page=skip // limit + 1,
        page_size=limit,
        items=[SongResponse.model_validate(song) for song in songs]
    )


@router.get("/trending", response_model=list[SongResponse])
async def get_trending_songs(
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db)
):
    """Get trending songs based on play count"""
    songs = SongService.get_trending_songs(db, limit=limit)
    return [SongResponse.model_validate(song) for song in songs]


@router.get("/search", response_model=SongListResponse)
async def search_songs(
    q: str = Query(..., min_length=1),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Search songs by title, artist, or album"""
    songs, total = SongService.search_songs(db, q, skip=skip, limit=limit)
    return SongListResponse(
        total=total,
        page=skip // limit + 1,
        page_size=limit,
        items=[SongResponse.model_validate(song) for song in songs]
    )


@router.get("/genre/{genre}", response_model=SongListResponse)
async def get_songs_by_genre(
    genre: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Get songs by genre"""
    songs, total = SongService.get_songs_by_genre(db, genre, skip=skip, limit=limit)
    return SongListResponse(
        total=total,
        page=skip // limit + 1,
        page_size=limit,
        items=[SongResponse.model_validate(song) for song in songs]
    )


@router.post("", response_model=SongResponse)
async def create_song(
    song_create: SongCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new song (admin only in production)"""
    song_data = song_create.model_dump()
    song_data["file_url"] = "/uploads/placeholder.mp3"  # This will be updated during file upload
    
    song = SongService.create_song(db, song_data)
    return SongResponse.model_validate(song)


@router.get("/{song_id}", response_model=SongDetailResponse)
async def get_song(
    song_id: int,
    db: Session = Depends(get_db)
):
    """Get song details"""
    song = SongService.get_song_by_id(db, song_id)
    if not song:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Song not found"
        )
    return SongDetailResponse.model_validate(song)


@router.get("/{song_id}/stream")
async def stream_song(
    song_id: int,
    db: Session = Depends(get_db)
):
    """Stream audio file with support for range requests"""
    song = SongService.get_song_by_id(db, song_id)
    if not song:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Song not found"
        )

    file_path = song.file_url
    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Audio file not found"
        )

    # Increment play count
    SongService.increment_play_count(db, song_id)

    return FileResponse(
        path=file_path,
        media_type="audio/mpeg",
        filename=f"{song.artist} - {song.title}.mp3"
    )


@router.post("/{song_id}/upload-audio")
async def upload_audio(
    song_id: int,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Upload audio file for a song"""
    song = SongService.get_song_by_id(db, song_id)
    if not song:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Song not found"
        )

    # Validate file extension
    file_ext = file.filename.split(".")[-1].lower()
    if file_ext not in settings.ALLOWED_AUDIO_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid audio format. Allowed: {', '.join(settings.ALLOWED_AUDIO_EXTENSIONS)}"
        )

    # Check file size
    contents = await file.read()
    if len(contents) > settings.MAX_UPLOAD_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="File size exceeds maximum allowed"
        )

    # Save file
    filename = f"{song_id}_{file.filename}"
    file_path = os.path.join(settings.UPLOAD_DIRECTORY, filename)
    
    with open(file_path, "wb") as f:
        f.write(contents)

    # Update song with file URL
    SongService.update_song(db, song, {"file_url": file_path})

    return {
        "message": "Audio file uploaded successfully",
        "filename": filename,
        "size": len(contents)
    }


@router.post("/{song_id}/upload-thumbnail")
async def upload_thumbnail(
    song_id: int,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Upload thumbnail image for a song"""
    song = SongService.get_song_by_id(db, song_id)
    if not song:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Song not found"
        )

    # Validate file extension
    file_ext = file.filename.split(".")[-1].lower()
    if file_ext not in settings.ALLOWED_IMAGE_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid image format. Allowed: {', '.join(settings.ALLOWED_IMAGE_EXTENSIONS)}"
        )

    # Save file
    filename = f"thumbnail_{song_id}_{file.filename}"
    file_path = os.path.join(settings.UPLOAD_DIRECTORY, filename)
    
    contents = await file.read()
    with open(file_path, "wb") as f:
        f.write(contents)

    # Update song with thumbnail URL
    SongService.update_song(db, song, {"thumbnail_url": file_path})

    return {
        "message": "Thumbnail uploaded successfully",
        "filename": filename
    }
