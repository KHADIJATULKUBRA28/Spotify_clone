"""
Favorite service - business logic for favorite operations
"""
from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.models import Song, User


class FavoriteService:
    """Favorite business logic"""

    @staticmethod
    def add_favorite(db: Session, user_id: int, song_id: int) -> bool:
        """Add song to favorites"""
        user = db.query(User).filter(User.id == user_id).first()
        song = db.query(Song).filter(Song.id == song_id).first()

        if not user or not song:
            return False

        if song not in user.favorite_songs:
            user.favorite_songs.append(song)
            db.add(user)
            db.commit()
        return True

    @staticmethod
    def remove_favorite(db: Session, user_id: int, song_id: int) -> bool:
        """Remove song from favorites"""
        user = db.query(User).filter(User.id == user_id).first()
        song = db.query(Song).filter(Song.id == song_id).first()

        if not user or not song:
            return False

        if song in user.favorite_songs:
            user.favorite_songs.remove(song)
            db.add(user)
            db.commit()
        return True

    @staticmethod
    def is_favorite(db: Session, user_id: int, song_id: int) -> bool:
        """Check if song is in user's favorites"""
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return False

        return db.query(Song).filter(
            Song.id == song_id,
            Song.favorited_by.any(User.id == user_id)
        ).first() is not None

    @staticmethod
    def get_user_favorites(
        db: Session,
        user_id: int,
        skip: int = 0,
        limit: int = 20
    ) -> tuple[List[Song], int]:
        """Get user's favorite songs with pagination"""
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return [], 0

        total = len(user.favorite_songs)
        favorites = user.favorite_songs[skip:skip + limit]
        return favorites, total
