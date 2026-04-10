# API Documentation

Complete API reference for the Kannada Spotify Clone backend.

## Base URL

```
http://localhost:8000/api
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <access_token>
```

## Response Format

All responses are in JSON format:

```json
{
  "status": "success",
  "data": {},
  "error": null
}
```

---

## 🔐 Authentication Endpoints

### Sign Up

Create a new user account.

**Endpoint:** `POST /auth/signup`

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "kannada_lover",
  "password": "securepassword123",
  "full_name": "Kannada Lover"
}
```

**Response:** `200 OK`
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "kannada_lover",
    "full_name": "Kannada Lover",
    "profile_picture": null,
    "created_at": "2024-01-15T10:30:00",
    "is_active": true
  }
}
```

### Login

Authenticate with email and password.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:** `200 OK`
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "kannada_lover",
    ...
  }
}
```

---

## 👤 User Endpoints

### Get Current User

Get the authenticated user's profile.

**Endpoint:** `GET /users/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "kannada_lover",
  "full_name": "Kannada Lover",
  "profile_picture": "https://...",
  "created_at": "2024-01-15T10:30:00",
  "is_active": true
}
```

### Get User Profile with Stats

Get extended user profile with statistics.

**Endpoint:** `GET /users/profile/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "kannada_lover",
  "full_name": "Kannada Lover",
  "profile_picture": "https://...",
  "created_at": "2024-01-15T10:30:00",
  "is_active": true,
  "favorite_songs_count": 25,
  "playlists_count": 5,
  "recently_played_count": 42
}
```

### Update User Profile

Update user information.

**Endpoint:** `PUT /users/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "full_name": "Updated Name",
  "profile_picture": "https://..."
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "kannada_lover",
  "full_name": "Updated Name",
  "profile_picture": "https://...",
  ...
}
```

---

## 🎵 Song Endpoints

### Get All Songs

Get paginated list of all songs.

**Endpoint:** `GET /songs`

**Query Parameters:**
- `skip` (int, default: 0) - Number of songs to skip
- `limit` (int, default: 20, max: 100) - Number of songs to return
- `sort_by` (string, default: "created_at") - Sort field (created_at, play_count, title)
- `order` (string, default: "desc") - Sort order (asc, desc)

**Example:** `GET /songs?skip=0&limit=20&sort_by=play_count&order=desc`

**Response:** `200 OK`
```json
{
  "total": 150,
  "page": 1,
  "page_size": 20,
  "items": [
    {
      "id": 1,
      "title": "Yaarige",
      "artist": "Hamsalekshmi",
      "album": "Collection",
      "genre": "Kannada",
      "duration": 240.5,
      "file_url": "/uploads/song1.mp3",
      "thumbnail_url": "/uploads/thumb1.jpg",
      "description": "Beautiful song...",
      "play_count": 150,
      "created_at": "2024-01-15T10:30:00"
    }
  ]
}
```

### Get Song Details

Get detailed information about a specific song.

**Endpoint:** `GET /songs/{song_id}`

**Response:** `200 OK`
```json
{
  "id": 1,
  "title": "Yaarige",
  "artist": "Hamsalekshmi",
  "album": "Collection",
  "genre": "Kannada",
  "duration": 240.5,
  "file_url": "/uploads/song1.mp3",
  "thumbnail_url": "/uploads/thumb1.jpg",
  "description": "Beautiful song...",
  "lyrics": "Yaarige nee bandha...",
  "play_count": 150,
  "created_at": "2024-01-15T10:30:00"
}
```

### Search Songs

Search songs by title, artist, or album.

**Endpoint:** `GET /songs/search`

**Query Parameters:**
- `q` (string, required) - Search query
- `skip` (int, default: 0) - Pagination offset
- `limit` (int, default: 20) - Results limit

**Example:** `GET /songs/search?q=yaarige&skip=0&limit=20`

**Response:** `200 OK`
```json
{
  "total": 5,
  "page": 1,
  "page_size": 20,
  "items": [
    {
      "id": 1,
      "title": "Yaarige",
      "artist": "Hamsalekshmi",
      ...
    }
  ]
}
```

### Get Songs by Genre

Get songs filtered by genre.

**Endpoint:** `GET /songs/genre/{genre}`

**Example:** `GET /songs/genre/Kannada`

**Response:** `200 OK`
```json
{
  "total": 45,
  "page": 1,
  "page_size": 20,
  "items": [...]
}
```

### Get Trending Songs

Get trending songs based on play count.

**Endpoint:** `GET /songs/trending`

**Query Parameters:**
- `limit` (int, default: 10, max: 50) - Number of songs to return

**Response:** `200 OK`
```json
[
  {
    "id": 5,
    "title": "Trending Song",
    "artist": "Popular Artist",
    "play_count": 5000,
    ...
  }
]
```

### Stream Song

Stream audio file for a song.

**Endpoint:** `GET /songs/{song_id}/stream`

**Response:** `200 OK` (Audio file with media type audio/mpeg)

### Create Song

Create a new song (typically admin only).

**Endpoint:** `POST /songs`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "New Song",
  "artist": "Artist Name",
  "album": "Album Name",
  "genre": "Kannada",
  "duration": 240.5,
  "description": "Song description",
  "lyrics": "Song lyrics..."
}
```

**Response:** `200 OK`
```json
{
  "id": 101,
  "title": "New Song",
  ...
}
```

### Upload Audio File

Upload audio file for a song.

**Endpoint:** `POST /songs/{song_id}/upload-audio`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
- `file` (file) - Audio file (mp3, wav, flac, m4a, aac)

**Response:** `200 OK`
```json
{
  "message": "Audio file uploaded successfully",
  "filename": "1_mysong.mp3",
  "size": 5242880
}
```

### Upload Thumbnail

Upload thumbnail image for a song.

**Endpoint:** `POST /songs/{song_id}/upload-thumbnail`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
- `file` (file) - Image file (jpg, jpeg, png, gif, webp)

**Response:** `200 OK`
```json
{
  "message": "Thumbnail uploaded successfully",
  "filename": "thumbnail_1_cover.jpg"
}
```

---

## 📋 Playlist Endpoints

### Get User Playlists

Get all playlists by current user.

**Endpoint:** `GET /playlists`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `skip` (int, default: 0)
- `limit` (int, default: 20)

**Response:** `200 OK`
```json
{
  "total": 5,
  "page": 1,
  "page_size": 20,
  "items": [
    {
      "id": 1,
      "name": "My Favorite Songs",
      "description": "My personal collection",
      "is_public": false,
      "thumbnail_url": "...",
      "user": {...},
      "created_at": "2024-01-15T10:30:00",
      "updated_at": "2024-01-15T10:30:00"
    }
  ]
}
```

### Get Playlist Details

Get a specific playlist with all its songs.

**Endpoint:** `GET /playlists/{playlist_id}`

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "My Favorite Songs",
  "description": "My personal collection",
  "is_public": false,
  "thumbnail_url": "...",
  "user": {...},
  "created_at": "2024-01-15T10:30:00",
  "updated_at": "2024-01-15T10:30:00",
  "songs": [
    {
      "id": 1,
      "title": "Song Title",
      ...
    }
  ]
}
```

### Create Playlist

Create a new playlist.

**Endpoint:** `POST /playlists`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "My New Playlist",
  "description": "A great collection",
  "is_public": false
}
```

**Response:** `201 Created`
```json
{
  "id": 2,
  "name": "My New Playlist",
  ...
}
```

### Update Playlist

Update playlist information.

**Endpoint:** `PUT /playlists/{playlist_id}`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Updated Playlist Name",
  "description": "Updated description",
  "is_public": true
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "Updated Playlist Name",
  ...
}
```

### Delete Playlist

Delete a playlist.

**Endpoint:** `DELETE /playlists/{playlist_id}`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "message": "Playlist deleted successfully"
}
```

### Add Song to Playlist

Add a song to a playlist.

**Endpoint:** `POST /playlists/{playlist_id}/songs`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "song_id": 1
}
```

**Response:** `200 OK`
```json
{
  "message": "Song added to playlist"
}
```

### Remove Song from Playlist

Remove a song from a playlist.

**Endpoint:** `DELETE /playlists/{playlist_id}/songs/{song_id}`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "message": "Song removed from playlist"
}
```

---

## ❤️ Favorites Endpoints

### Get Favorite Songs

Get all songs marked as favorites by current user.

**Endpoint:** `GET /favorites`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `skip` (int, default: 0)
- `limit` (int, default: 20)

**Response:** `200 OK`
```json
{
  "songs": [
    {
      "id": 1,
      "title": "Favorite Song",
      ...
    }
  ],
  "total": 25
}
```

### Add to Favorites

Mark a song as favorite.

**Endpoint:** `POST /favorites`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "song_id": 1
}
```

**Response:** `200 OK`
```json
{
  "message": "Song added to favorites"
}
```

### Remove from Favorites

Unmark a song from favorites.

**Endpoint:** `DELETE /favorites/{song_id}`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "message": "Song removed from favorites"
}
```

### Check if Song is Favorite

Check if a song is in user's favorites.

**Endpoint:** `GET /favorites/{song_id}/check`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "is_favorite": true
}
```

---

## 📱 Recently Played Endpoints

### Get Recently Played

Get recently played songs.

**Endpoint:** `GET /recently-played`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `limit` (int, default: 20)

**Response:** `200 OK`
```json
{
  "items": [
    {
      "song": {
        "id": 1,
        "title": "Recently Played Song",
        ...
      },
      "played_at": "2024-01-15T15:45:00"
    }
  ],
  "total": 42
}
```

### Add to Recently Played

Add a song to recently played history.

**Endpoint:** `POST /recently-played/{song_id}`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "message": "Song added to recently played"
}
```

---

## Error Responses

### 400 Bad Request

```json
{
  "detail": "Invalid request format"
}
```

### 401 Unauthorized

```json
{
  "detail": "Invalid token or not authenticated",
  "headers": {"WWW-Authenticate": "Bearer"}
}
```

### 403 Forbidden

```json
{
  "detail": "Not authorized to perform this action"
}
```

### 404 Not Found

```json
{
  "detail": "Resource not found"
}
```

### 500 Internal Server Error

```json
{
  "detail": "Internal server error"
}
```

---

## Rate Limiting

Currently not implemented, but recommended for production:
- 100 requests per minute per IP
- 1000 requests per hour per user

---

## CORS

Allowed origins:
- http://localhost:5173
- http://127.0.0.1:5173
- http://localhost:3000
- http://127.0.0.1:3000

---

## Testing with cURL

### Example: Login and Search

```bash
# 1. Login
TOKEN=$(curl -s -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}' \
  | python -c "import sys, json; print(json.load(sys.stdin)['access_token'])")

# 2. Search songs
curl -X GET "http://localhost:8000/api/songs/search?q=yaarige" \
  -H "Authorization: Bearer $TOKEN"
```

---

**For interactive testing, visit:** http://localhost:8000/api/docs
