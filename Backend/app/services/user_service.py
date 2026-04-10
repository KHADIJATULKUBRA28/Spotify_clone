"""
User service - business logic for user operations
"""
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from app.models import User, Playlist, Song, user_favorites
from app.schemas import UserCreate, UserUpdate
from app.auth import AuthService


class UserService:
    """User business logic"""

    @staticmethod
    def create_user(db: Session, user_create: UserCreate) -> User:
        """Create a new user"""
        hashed_password = AuthService.hash_password(user_create.password)
        db_user = User(
            email=user_create.email,
            username=user_create.username,
            hashed_password=hashed_password,
            full_name=user_create.full_name,
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    @staticmethod
    def get_user_by_email(db: Session, email: str) -> User | None:
        """Get user by email"""
        return db.query(User).filter(User.email == email).first()

    @staticmethod
    def get_user_by_username(db: Session, username: str) -> User | None:
        """Get user by username"""
        return db.query(User).filter(User.username == username).first()

    @staticmethod
    def get_user_by_id(db: Session, user_id: int) -> User | None:
        """Get user by ID"""
        return db.query(User).filter(User.id == user_id).first()

    @staticmethod
    def update_user(db: Session, user: User, user_update: UserUpdate) -> User:
        """Update user information"""
        update_data = user_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(user, field, value)
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def get_user_profile(db: Session, user: User) -> dict:
        """Get user profile with statistics"""
        favorite_count = db.query(func.count(user_favorites.c.song_id)).filter(
            user_favorites.c.user_id == user.id
        ).scalar()
        
        playlist_count = db.query(func.count(Playlist.id)).filter(
            Playlist.user_id == user.id
        ).scalar()

        return {
            "id": user.id,
            "email": user.email,
            "username": user.username,
            "full_name": user.full_name,
            "profile_picture": user.profile_picture,
            "created_at": user.created_at,
            "is_active": user.is_active,
            "favorite_songs_count": favorite_count,
            "playlists_count": playlist_count,
            "recently_played_count": 0,
        }
