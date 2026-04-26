"""
Main FastAPI application
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from pathlib import Path

from config import get_settings
from database import Base, engine, SessionLocal
from app.routers import auth, users, songs, playlists, favorites, recently_played
from app.models import Song

# Create database tables
Base.metadata.create_all(bind=engine)

settings = get_settings()

# Create FastAPI app
app = FastAPI(
    title=settings.API_TITLE,
    description=settings.API_DESCRIPTION,
    version=settings.API_VERSION,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
Path(settings.UPLOAD_DIRECTORY).mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIRECTORY), name="uploads")

# Include routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(songs.router)
app.include_router(playlists.router)
app.include_router(favorites.router)
app.include_router(recently_played.router)


# Seed data
SEED_SONGS = [
    {
        "title": "Abstract Dreams",
        "artist": "Coma-Media",
        "album": "Electronic Vibes",
        "genre": "Electronic",
        "duration": 132.0,
        "file_url": "https://cdn.pixabay.com/audio/2024/11/28/audio_3a4d85018d.mp3",
        "thumbnail_url": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop",
        "description": "Dreamy electronic track with ambient vibes",
        "play_count": 1842,
    },
    {
        "title": "Euphoria",
        "artist": "Lexin Music",
        "album": "Pop Hits",
        "genre": "Pop",
        "duration": 180.0,
        "file_url": "https://cdn.pixabay.com/audio/2024/02/14/audio_8e63e8ddfe.mp3",
        "thumbnail_url": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
        "description": "Uplifting pop track with catchy melodies",
        "play_count": 3201,
    },
    {
        "title": "Night Drive",
        "artist": "Alexi Action",
        "album": "Synthwave Nights",
        "genre": "Synthwave",
        "duration": 210.0,
        "file_url": "https://cdn.pixabay.com/audio/2024/09/10/audio_6e1eaa099f.mp3",
        "thumbnail_url": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop",
        "description": "Retro synthwave vibes for late night drives",
        "play_count": 2567,
    },
    {
        "title": "Lofi Study",
        "artist": "FASSounds",
        "album": "Chill Beats",
        "genre": "Lo-Fi",
        "duration": 145.0,
        "file_url": "https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3",
        "thumbnail_url": "https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=300&h=300&fit=crop",
        "description": "Relaxing lo-fi beats perfect for studying",
        "play_count": 5430,
    },
    {
        "title": "Inspiring Cinematic",
        "artist": "Muzaproduction",
        "album": "Epic Scores",
        "genre": "Cinematic",
        "duration": 198.0,
        "file_url": "https://cdn.pixabay.com/audio/2022/02/22/audio_d1718ab41b.mp3",
        "thumbnail_url": "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=300&h=300&fit=crop",
        "description": "Epic cinematic orchestral piece",
        "play_count": 4102,
    },
    {
        "title": "Good Night",
        "artist": "FASSounds",
        "album": "Acoustic Sessions",
        "genre": "Acoustic",
        "duration": 120.0,
        "file_url": "https://cdn.pixabay.com/audio/2022/01/18/audio_d0a13f69d2.mp3",
        "thumbnail_url": "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=300&h=300&fit=crop",
        "description": "Gentle acoustic guitar lullaby",
        "play_count": 2890,
    },
    {
        "title": "Powerful Beat",
        "artist": "Alexi Action",
        "album": "Hip-Hop Collection",
        "genre": "Hip-Hop",
        "duration": 165.0,
        "file_url": "https://cdn.pixabay.com/audio/2023/07/19/audio_e552e6e325.mp3",
        "thumbnail_url": "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop",
        "description": "Hard-hitting hip-hop beat with bass",
        "play_count": 3450,
    },
    {
        "title": "Summer Walk",
        "artist": "Olexy",
        "album": "Sunny Days",
        "genre": "Acoustic",
        "duration": 150.0,
        "file_url": "https://cdn.pixabay.com/audio/2022/08/23/audio_d16737dc28.mp3",
        "thumbnail_url": "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop",
        "description": "Happy acoustic walk in the summer sun",
        "play_count": 6201,
    },
    {
        "title": "Deep Future Garage",
        "artist": "Coma-Media",
        "album": "Bass Culture",
        "genre": "Electronic",
        "duration": 225.0,
        "file_url": "https://cdn.pixabay.com/audio/2022/04/27/audio_67bcce71c1.mp3",
        "thumbnail_url": "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=300&h=300&fit=crop",
        "description": "Deep bass-heavy electronic track",
        "play_count": 1920,
    },
    {
        "title": "Ambient Piano",
        "artist": "Lesfm",
        "album": "Piano Stories",
        "genre": "Classical",
        "duration": 195.0,
        "file_url": "https://cdn.pixabay.com/audio/2024/01/30/audio_f988e8aa7f.mp3",
        "thumbnail_url": "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=300&h=300&fit=crop",
        "description": "Beautiful ambient piano composition",
        "play_count": 3780,
    },
    {
        "title": "Jazzy Chill",
        "artist": "Lemon Music Studio",
        "album": "Jazz Cafe",
        "genre": "Jazz",
        "duration": 180.0,
        "file_url": "https://cdn.pixabay.com/audio/2024/09/26/audio_b3e4c54d3f.mp3",
        "thumbnail_url": "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=300&h=300&fit=crop",
        "description": "Smooth jazz for a relaxing evening",
        "play_count": 2340,
    },
    {
        "title": "Upbeat Funk",
        "artist": "Stockaudios",
        "album": "Funky Town",
        "genre": "Funk",
        "duration": 156.0,
        "file_url": "https://cdn.pixabay.com/audio/2023/10/14/audio_c7e0433fee.mp3",
        "thumbnail_url": "https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=300&h=300&fit=crop",
        "description": "Groovy funk track to get you moving",
        "play_count": 1560,
    },
    {
        "title": "Tropical Vibes",
        "artist": "Lesfm",
        "album": "Island Life",
        "genre": "Tropical",
        "duration": 174.0,
        "file_url": "https://cdn.pixabay.com/audio/2023/09/25/audio_f3b2b0f50c.mp3",
        "thumbnail_url": "https://images.unsplash.com/photo-1505672678657-cc7037095e60?w=300&h=300&fit=crop",
        "description": "Tropical house beats with island feel",
        "play_count": 2100,
    },
    {
        "title": "Rock Energy",
        "artist": "Alexi Action",
        "album": "Power Rock",
        "genre": "Rock",
        "duration": 190.0,
        "file_url": "https://cdn.pixabay.com/audio/2023/12/14/audio_65e4bbc2df.mp3",
        "thumbnail_url": "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=300&h=300&fit=crop",
        "description": "High energy rock anthem",
        "play_count": 4500,
    },
    {
        "title": "Chill Lounge",
        "artist": "Coma-Media",
        "album": "After Hours",
        "genre": "Lo-Fi",
        "duration": 200.0,
        "file_url": "https://cdn.pixabay.com/audio/2023/04/17/audio_55498e498c.mp3",
        "thumbnail_url": "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=300&fit=crop",
        "description": "Chilled out lounge music for relaxation",
        "play_count": 3100,
    },
    {
        "title": "Happy Claps",
        "artist": "Mixaund",
        "album": "Feel Good",
        "genre": "Pop",
        "duration": 135.0,
        "file_url": "https://cdn.pixabay.com/audio/2022/10/16/audio_50f3d1e498.mp3",
        "thumbnail_url": "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=300&h=300&fit=crop",
        "description": "Happy and upbeat pop with clapping rhythm",
        "play_count": 2750,
    },
    {
        "title": "Dark Ambient",
        "artist": "SergePavkinMusic",
        "album": "Shadows",
        "genre": "Ambient",
        "duration": 240.0,
        "file_url": "https://cdn.pixabay.com/audio/2023/01/16/audio_68ba623346.mp3",
        "thumbnail_url": "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=300&h=300&fit=crop",
        "description": "Dark atmospheric ambient soundscape",
        "play_count": 1200,
    },
    {
        "title": "Morning Coffee",
        "artist": "Lesfm",
        "album": "Daily Rituals",
        "genre": "Acoustic",
        "duration": 168.0,
        "file_url": "https://cdn.pixabay.com/audio/2024/07/24/audio_be30ed8e1f.mp3",
        "thumbnail_url": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop",
        "description": "Gentle acoustic guitar for your morning",
        "play_count": 4800,
    },
    {
        "title": "Future Bass",
        "artist": "Coma-Media",
        "album": "Digital World",
        "genre": "Electronic",
        "duration": 188.0,
        "file_url": "https://cdn.pixabay.com/audio/2023/08/09/audio_3b7e49fce5.mp3",
        "thumbnail_url": "https://images.unsplash.com/photo-1614149162883-504ce4d13909?w=300&h=300&fit=crop",
        "description": "Futuristic bass-driven electronic track",
        "play_count": 2200,
    },
    {
        "title": "Peaceful Garden",
        "artist": "Olexy",
        "album": "Nature Sounds",
        "genre": "Ambient",
        "duration": 210.0,
        "file_url": "https://cdn.pixabay.com/audio/2023/06/09/audio_ae3cf7ad79.mp3",
        "thumbnail_url": "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop",
        "description": "Peaceful ambient music inspired by nature",
        "play_count": 1890,
    },
    {
        "title": "Motivational",
        "artist": "Muzaproduction",
        "album": "Rise Up",
        "genre": "Cinematic",
        "duration": 155.0,
        "file_url": "https://cdn.pixabay.com/audio/2023/09/04/audio_3e4af1e8ab.mp3",
        "thumbnail_url": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
        "description": "Motivational and uplifting cinematic music",
        "play_count": 5100,
    },
    {
        "title": "Neon City",
        "artist": "Alexi Action",
        "album": "Cyberpunk",
        "genre": "Synthwave",
        "duration": 220.0,
        "file_url": "https://cdn.pixabay.com/audio/2024/03/11/audio_a9a3c56d96.mp3",
        "thumbnail_url": "https://images.unsplash.com/photo-1563089145-599997674d42?w=300&h=300&fit=crop",
        "description": "Cyberpunk synthwave with neon aesthetics",
        "play_count": 3300,
    },
    {
        "title": "Smooth R&B",
        "artist": "Lemon Music Studio",
        "album": "Velvet",
        "genre": "R&B",
        "duration": 175.0,
        "file_url": "https://cdn.pixabay.com/audio/2023/11/07/audio_c3c244dce3.mp3",
        "thumbnail_url": "https://images.unsplash.com/photo-1446057032654-9d8885571b40?w=300&h=300&fit=crop",
        "description": "Smooth R&B with silky vocals",
        "play_count": 2600,
    },
    {
        "title": "Guitar Ballad",
        "artist": "Olexy",
        "album": "Strings & Things",
        "genre": "Acoustic",
        "duration": 198.0,
        "file_url": "https://cdn.pixabay.com/audio/2024/04/18/audio_df0e65c61a.mp3",
        "thumbnail_url": "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=300&h=300&fit=crop",
        "description": "Emotional acoustic guitar ballad",
        "play_count": 3900,
    },
    {
        "title": "EDM Festival",
        "artist": "Coma-Media",
        "album": "Main Stage",
        "genre": "EDM",
        "duration": 205.0,
        "file_url": "https://cdn.pixabay.com/audio/2023/03/20/audio_642eda6a1e.mp3",
        "thumbnail_url": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop",
        "description": "Festival-ready EDM banger",
        "play_count": 4700,
    },
    {
        "title": "Midnight Blues",
        "artist": "SergePavkinMusic",
        "album": "Blue Notes",
        "genre": "Blues",
        "duration": 230.0,
        "file_url": "https://cdn.pixabay.com/audio/2023/05/23/audio_4e1e2eded8.mp3",
        "thumbnail_url": "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=300&h=300&fit=crop",
        "description": "Soulful midnight blues guitar",
        "play_count": 1700,
    },
    {
        "title": "Kids Playing",
        "artist": "Mixaund",
        "album": "Carefree",
        "genre": "Pop",
        "duration": 142.0,
        "file_url": "https://cdn.pixabay.com/audio/2022/03/15/audio_115618a80d.mp3",
        "thumbnail_url": "https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=300&h=300&fit=crop",
        "description": "Playful and cheerful pop music",
        "play_count": 2400,
    },
    {
        "title": "Dreamy Pad",
        "artist": "FASSounds",
        "album": "Ethereal",
        "genre": "Ambient",
        "duration": 195.0,
        "file_url": "https://cdn.pixabay.com/audio/2024/06/07/audio_3b65982e04.mp3",
        "thumbnail_url": "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=300&h=300&fit=crop",
        "description": "Dreamy pad textures and floating melodies",
        "play_count": 1450,
    },
    {
        "title": "Urban Groove",
        "artist": "Stockaudios",
        "album": "City Sounds",
        "genre": "Hip-Hop",
        "duration": 170.0,
        "file_url": "https://cdn.pixabay.com/audio/2023/02/15/audio_862ad5f394.mp3",
        "thumbnail_url": "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop",
        "description": "Urban hip-hop groove with modern production",
        "play_count": 2900,
    },
    {
        "title": "Cinematic Trailer",
        "artist": "Muzaproduction",
        "album": "Blockbuster",
        "genre": "Cinematic",
        "duration": 125.0,
        "file_url": "https://cdn.pixabay.com/audio/2022/11/22/audio_febc508520.mp3",
        "thumbnail_url": "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=300&h=300&fit=crop",
        "description": "Epic cinematic trailer music",
        "play_count": 5800,
    },
]


@app.on_event("startup")
async def seed_database():
    """Seed database with sample songs if empty"""
    db = SessionLocal()
    try:
        count = db.query(Song).count()
        if count == 0:
            print("Seeding database with sample songs...")
            for song_data in SEED_SONGS:
                song = Song(**song_data)
                db.add(song)
            db.commit()
            print(f"Seeded {len(SEED_SONGS)} songs successfully!")
        else:
            print(f"Database already has {count} songs, skipping seed.")
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()


@app.get("/")
async def root():
    """API root endpoint"""
    return {
        "name": settings.API_TITLE,
        "version": settings.API_VERSION,
        "description": settings.API_DESCRIPTION,
        "docs_url": "/api/docs",
        "redoc_url": "/api/redoc"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler"""
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
