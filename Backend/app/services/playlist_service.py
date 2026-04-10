"""
Playlist service - business logic for playlist operations
"""
from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.models import Playlist, Song


class PlaylistService:
    """Playlist business logic"""

    @staticmethod
    def create_playlist(
        db: Session,
        user_id: int,
        name: str,
        description: str | None = None,
        is_public: bool = False
    ) -> Playlist:
        """Create a new playlist"""
        playlist = Playlist(
            name=name,
            description=description,
            user_id=user_id,
            is_public=is_public
        )
        db.add(playlist)
        db.commit()
        db.refresh(playlist)
        return playlist

    @staticmethod
    def get_playlist_by_id(db: Session, playlist_id: int) -> Playlist | None:
        """Get playlist by ID"""
        return db.query(Playlist).filter(Playlist.id == playlist_id).first()

    @staticmethod
    def get_user_playlists(
        db: Session,
        user_id: int,
        skip: int = 0,
        limit: int = 20
    ) -> tuple[List[Playlist], int]:
        """Get user's playlists"""
        query = db.query(Playlist).filter(Playlist.user_id == user_id)
        total = query.count()
        playlists = query.order_by(desc(Playlist.created_at)).offset(skip).limit(limit).all()
        return playlists, total

    @staticmethod
    def get_public_playlists(
        db: Session,
        skip: int = 0,
        limit: int = 20
    ) -> tuple[List[Playlist], int]:
        """Get public playlists"""
        query = db.query(Playlist).filter(Playlist.is_public == True)
        total = query.count()
        playlists = query.order_by(desc(Playlist.created_at)).offset(skip).limit(limit).all()
        return playlists, total

    @staticmethod
    def update_playlist(
        db: Session,
        playlist: Playlist,
        name: str | None = None,
        description: str | None = None,
        is_public: bool | None = None
    ) -> Playlist:
        """Update playlist"""
        if name is not None:
            playlist.name = name
        if description is not None:
            playlist.description = description
        if is_public is not None:
            playlist.is_public = is_public
        db.add(playlist)
        db.commit()
        db.refresh(playlist)
        return playlist

    @staticmethod
    def delete_playlist(db: Session, playlist_id: int) -> bool:
        """Delete playlist"""
        playlist = db.query(Playlist).filter(Playlist.id == playlist_id).first()
        if playlist:
            db.delete(playlist)
            db.commit()
            return True
        return False

    @staticmethod
    def add_song_to_playlist(db: Session, playlist_id: int, song_id: int) -> bool:
        """Add song to playlist"""
        playlist = db.query(Playlist).filter(Playlist.id == playlist_id).first()
        song = db.query(Song).filter(Song.id == song_id).first()

        if not playlist or not song:
            return False

        if song not in playlist.songs:
            playlist.songs.append(song)
            db.add(playlist)
            db.commit()
        return True

    @staticmethod
    def remove_song_from_playlist(db: Session, playlist_id: int, song_id: int) -> bool:
        """Remove song from playlist"""
        playlist = db.query(Playlist).filter(Playlist.id == playlist_id).first()
        song = db.query(Song).filter(Song.id == song_id).first()

        if not playlist or not song:
            return False

        if song in playlist.songs:
            playlist.songs.remove(song)
            db.add(playlist)
            db.commit()
        return True

    @staticmethod
    def get_playlist_songs(
        db: Session,
        playlist_id: int,
        skip: int = 0,
        limit: int = 20
    ) -> tuple[List[Song], int]:
        """Get songs in playlist with pagination"""
        playlist = db.query(Playlist).filter(Playlist.id == playlist_id).first()
        if not playlist:
            return [], 0

        total = len(playlist.songs)
        songs = playlist.songs[skip:skip + limit]
        return songs, total
