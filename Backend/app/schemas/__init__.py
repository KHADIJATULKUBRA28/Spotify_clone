"""
Pydantic schemas for request/response validation
"""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field


# ==================== User Schemas ====================
class UserCreate(BaseModel):
    """Schema for user creation"""
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=8)
    full_name: Optional[str] = None


class UserUpdate(BaseModel):
    """Schema for user update"""
    full_name: Optional[str] = None
    profile_picture: Optional[str] = None


class UserResponse(BaseModel):
    """Schema for user response"""
    id: int
    email: str
    username: str
    full_name: Optional[str] = None
    profile_picture: Optional[str] = None
    created_at: datetime
    is_active: bool

    class Config:
        from_attributes = True


class UserProfileResponse(UserResponse):
    """Extended user profile response"""
    favorite_songs_count: int = 0
    playlists_count: int = 0
    recently_played_count: int = 0


# ==================== Authentication Schemas ====================
class LoginRequest(BaseModel):
    """Schema for login request"""
    email: str
    password: str


class TokenResponse(BaseModel):
    """Schema for token response"""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class TokenData(BaseModel):
    """Schema for token data"""
    email: Optional[str] = None


# ==================== Song Schemas ====================
class SongCreate(BaseModel):
    """Schema for song creation"""
    title: str = Field(..., min_length=1, max_length=255)
    artist: str = Field(..., min_length=1, max_length=255)
    album: Optional[str] = None
    genre: Optional[str] = None
    duration: float = Field(..., gt=0)
    description: Optional[str] = None
    lyrics: Optional[str] = None


class SongUpdate(BaseModel):
    """Schema for song update"""
    title: Optional[str] = None
    artist: Optional[str] = None
    album: Optional[str] = None
    genre: Optional[str] = None
    description: Optional[str] = None
    lyrics: Optional[str] = None


class SongResponse(BaseModel):
    """Schema for song response"""
    id: int
    title: str
    artist: str
    album: Optional[str] = None
    genre: Optional[str] = None
    duration: float
    file_url: str
    thumbnail_url: Optional[str] = None
    description: Optional[str] = None
    play_count: int
    created_at: datetime

    class Config:
        from_attributes = True


class SongDetailResponse(SongResponse):
    """Extended song response with lyrics"""
    lyrics: Optional[str] = None


class SongListResponse(BaseModel):
    """Schema for song list with pagination"""
    total: int
    page: int
    page_size: int
    items: List[SongResponse]


# ==================== Playlist Schemas ====================
class PlaylistCreate(BaseModel):
    """Schema for playlist creation"""
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    is_public: bool = False


class PlaylistUpdate(BaseModel):
    """Schema for playlist update"""
    name: Optional[str] = None
    description: Optional[str] = None
    is_public: Optional[bool] = None


class PlaylistResponse(BaseModel):
    """Schema for playlist response"""
    id: int
    name: str
    description: Optional[str] = None
    is_public: bool
    user: UserResponse
    thumbnail_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PlaylistDetailResponse(PlaylistResponse):
    """Extended playlist response with songs"""
    songs: List[SongResponse]


class PlaylistListResponse(BaseModel):
    """Schema for playlist list with pagination"""
    total: int
    page: int
    page_size: int
    items: List[PlaylistResponse]


class AddSongToPlaylistRequest(BaseModel):
    """Schema for adding song to playlist"""
    song_id: int


# ==================== Favorite Schemas ====================
class FavoriteResponse(BaseModel):
    """Schema for favorite response"""
    songs: List[SongResponse]
    total: int


class AddFavoriteRequest(BaseModel):
    """Schema for adding favorite"""
    song_id: int


# ==================== Recently Played Schemas ====================
class RecentlyPlayedResponse(BaseModel):
    """Schema for recently played response"""
    song: SongResponse
    played_at: datetime

    class Config:
        from_attributes = True


class RecentlyPlayedListResponse(BaseModel):
    """Schema for recently played list"""
    items: List[RecentlyPlayedResponse]
    total: int


# ==================== Search Schemas ====================
class SearchResponse(BaseModel):
    """Schema for search response"""
    songs: List[SongResponse]
    playlists: List[PlaylistResponse]


# ==================== Upload Response Schemas ====================
class FileUploadResponse(BaseModel):
    """Schema for file upload response"""
    filename: str
    url: str
    size: int
    uploaded_at: datetime
