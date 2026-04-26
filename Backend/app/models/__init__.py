"""
SQLAlchemy models for database tables
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, Table, Float
from sqlalchemy.orm import relationship
from database import Base

# Association table for many-to-many relationship between songs and playlists
playlist_songs = Table(
    "playlist_songs",
    Base.metadata,
    Column("playlist_id", Integer, ForeignKey("playlists.id", ondelete="CASCADE"), primary_key=True),
    Column("song_id", Integer, ForeignKey("songs.id", ondelete="CASCADE"), primary_key=True),
)

# Association table for many-to-many relationship between users and favorite songs
user_favorites = Table(
    "user_favorites",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
    Column("song_id", Integer, ForeignKey("songs.id", ondelete="CASCADE"), primary_key=True),
)


class User(Base):
    """User model"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String, nullable=True)
    profile_picture = Column(String, nullable=True)  # URL or file path
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    playlists = relationship("Playlist", back_populates="user", cascade="all, delete-orphan")
    favorite_songs = relationship(
        "Song", 
        secondary=user_favorites,
        back_populates="favorited_by"
    )
    recently_played = relationship(
        "RecentlyPlayed",
        back_populates="user",
        cascade="all, delete-orphan"
    )


class Song(Base):
    """Song model"""
    __tablename__ = "songs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    artist = Column(String, index=True)
    album = Column(String, nullable=True)
    genre = Column(String, nullable=True)
    duration = Column(Float)  # Duration in seconds
    file_url = Column(String)  # S3 URL or local file path
    thumbnail_url = Column(String, nullable=True)  # Album art thumbnail
    description = Column(Text, nullable=True)
    lyrics = Column(Text, nullable=True)  # Song lyrics
    play_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    playlists = relationship(
        "Playlist",
        secondary=playlist_songs,
        back_populates="songs"
    )
    favorited_by = relationship(
        "User",
        secondary=user_favorites,
        back_populates="favorite_songs"
    )
    recently_played = relationship(
        "RecentlyPlayed",
        back_populates="song",
        cascade="all, delete-orphan"
    )


class Playlist(Base):
    """Playlist model"""
    __tablename__ = "playlists"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    is_public = Column(Boolean, default=False)
    thumbnail_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="playlists")
    songs = relationship(
        "Song",
        secondary=playlist_songs,
        back_populates="playlists"
    )


class RecentlyPlayed(Base):
    """Recently played songs tracking"""
    __tablename__ = "recently_played"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    song_id = Column(Integer, ForeignKey("songs.id", ondelete="CASCADE"))
    played_at = Column(DateTime, default=datetime.utcnow, index=True)

    # Relationships
    user = relationship("User", back_populates="recently_played")
    song = relationship("Song", back_populates="recently_played")
