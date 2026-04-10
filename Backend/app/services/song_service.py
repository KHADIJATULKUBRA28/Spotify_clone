"""
Song service - business logic for song operations
"""
from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import func, desc, and_
from app.models import Song, RecentlyPlayed, user_favorites


class SongService:
    """Song business logic"""

    @staticmethod
    def create_song(db: Session, song_data: dict) -> Song:
        """Create a new song"""
        db_song = Song(**song_data)
        db.add(db_song)
        db.commit()
        db.refresh(db_song)
        return db_song

    @staticmethod
    def get_song_by_id(db: Session, song_id: int) -> Song | None:
        """Get song by ID"""
        return db.query(Song).filter(Song.id == song_id).first()

    @staticmethod
    def get_all_songs(
        db: Session,
        skip: int = 0,
        limit: int = 20,
        sort_by: str = "created_at",
        order: str = "desc"
    ) -> tuple[List[Song], int]:
        """Get all songs with pagination"""
        query = db.query(Song)
        total = query.count()

        if order.lower() == "desc":
            query = query.order_by(desc(getattr(Song, sort_by)))
        else:
            query = query.order_by(getattr(Song, sort_by))

        songs = query.offset(skip).limit(limit).all()
        return songs, total

    @staticmethod
    def search_songs(
        db: Session,
        query_str: str,
        skip: int = 0,
        limit: int = 20
    ) -> tuple[List[Song], int]:
        """Search songs by title, artist, or album"""
        query = db.query(Song).filter(
            (Song.title.ilike(f"%{query_str}%")) |
            (Song.artist.ilike(f"%{query_str}%")) |
            (Song.album.ilike(f"%{query_str}%"))
        )
        total = query.count()
        songs = query.offset(skip).limit(limit).all()
        return songs, total

    @staticmethod
    def get_songs_by_genre(
        db: Session,
        genre: str,
        skip: int = 0,
        limit: int = 20
    ) -> tuple[List[Song], int]:
        """Get songs by genre"""
        query = db.query(Song).filter(Song.genre.ilike(f"%{genre}%"))
        total = query.count()
        songs = query.offset(skip).limit(limit).all()
        return songs, total

    @staticmethod
    def get_trending_songs(
        db: Session,
        limit: int = 10
    ) -> List[Song]:
        """Get trending songs based on play count"""
        return db.query(Song).order_by(desc(Song.play_count)).limit(limit).all()

    @staticmethod
    def update_song(db: Session, song: Song, song_data: dict) -> Song:
        """Update song information"""
        for key, value in song_data.items():
            if value is not None:
                setattr(song, key, value)
        db.add(song)
        db.commit()
        db.refresh(song)
        return song

    @staticmethod
    def delete_song(db: Session, song_id: int) -> bool:
        """Delete song"""
        song = db.query(Song).filter(Song.id == song_id).first()
        if song:
            db.delete(song)
            db.commit()
            return True
        return False

    @staticmethod
    def increment_play_count(db: Session, song_id: int) -> None:
        """Increment play count for a song"""
        song = db.query(Song).filter(Song.id == song_id).first()
        if song:
            song.play_count += 1
            db.add(song)
            db.commit()

    @staticmethod
    def add_to_recently_played(db: Session, user_id: int, song_id: int) -> None:
        """Add song to recently played"""
        # Remove old entry if exists
        db.query(RecentlyPlayed).filter(
            and_(
                RecentlyPlayed.user_id == user_id,
                RecentlyPlayed.song_id == song_id
            )
        ).delete()

        # Add new entry
        recently_played = RecentlyPlayed(user_id=user_id, song_id=song_id)
        db.add(recently_played)
        db.commit()

    @staticmethod
    def get_recently_played(
        db: Session,
        user_id: int,
        limit: int = 20
    ) -> List[RecentlyPlayed]:
        """Get recently played songs for a user"""
        return db.query(RecentlyPlayed).filter(
            RecentlyPlayed.user_id == user_id
        ).order_by(desc(RecentlyPlayed.played_at)).limit(limit).all()
