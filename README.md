# 🎵 Spotify Clone - Full-Stack Music Streaming Application

A production-ready full-stack music streaming application specialized for songs, built with modern web technologies.

## 🚀 Features

### 1. **Authentication & Users**
- ✅ JWT-based authentication
- ✅ Secure password hashing with bcrypt
- ✅ User signup/login
- ✅ User profiles with statistics
- ✅ Profile picture upload

### 2. **Music Management**
- ✅ Upload songs (audio files)
- ✅ Store song metadata (title, artist, album, genre, duration)
- ✅ Thumbnail upload for songs
- ✅ Stream audio files efficiently
- ✅ Play count tracking

### 3. **Player Features**
- ✅ Play/Pause/Next/Previous controls
- ✅ Seek bar with progress control
- ✅ Volume control
- ✅ Repeat modes (off, all, one)
- ✅ Shuffle functionality
- ✅ Currently playing info display

### 4. **Playlist System**
- ✅ Create custom playlists
- ✅ Add/remove songs from playlists
- ✅ Public/private playlist options
- ✅ Playlist management (edit, delete)

### 5. **Favorites**
- ✅ Mark songs as favorites
- ✅ Quick access to favorite songs
- ✅ Favorite count tracking

### 6. **Search & Discovery**
- ✅ Search songs by title, artist, or album
- ✅ Browse by genre
- ✅ Trending songs based on play count
- ✅ Recently played songs history

### 7. **UI/UX**
- ✅ Spotify-inspired dark theme
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Smooth animations and transitions
- ✅ Accessible navigation
- ✅ Loading states and error handling

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: SQLite (development) / PostgreSQL (production)
- **ORM**: SQLAlchemy
- **Authentication**: JWT + Passlib
- **Validation**: Pydantic
- **Server**: Uvicorn

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v6
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **API Client**: Axios

### DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Environment**: .env configuration

## 📋 Prerequisites

- Python 3.11+
- Node.js 18+
- npm or yarn
- Docker & Docker Compose (optional)

## 🚀 Quick Start

### Option 1: Local Development Setup

#### Backend Setup

1. **Navigate to Backend directory**
   ```bash
   cd Backend
   ```

2. **Create and activate virtual environment**
   ```bash
   # Windows
   python -m venv env
   env\Scripts\activate

   # macOS/Linux
   python3 -m venv env
   source env/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   ```bash
   # Edit .env file with your settings
   cat > .env << EOF
   DATABASE_URL=sqlite:///./spotify_clone.db
   SECRET_KEY=your-super-secret-key-here
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   CORS_ORIGINS=["http://localhost:5173", "http://127.0.0.1:5173"]
   EOF
   ```

5. **Run the backend server**
   ```bash
   python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

   The API will be available at:
   - **API**: http://localhost:8000
   - **API Docs (Swagger)**: http://localhost:8000/api/docs
   - **ReDoc**: http://localhost:8000/api/redoc

#### Frontend Setup

1. **Navigate to Frontend directory** (in a new terminal)
   ```bash
   cd Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cat > .env << EOF
   VITE_API_BASE_URL=http://localhost:8000
   VITE_APP_NAME=Kannada Spotify Clone
   EOF
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

   The application will be available at:
   - **Frontend**: http://localhost:5173

### Option 2: Docker Setup

1. **Ensure Docker and Docker Compose are installed**

2. **From the project root, run:**
   ```bash
   docker-compose up --build
   ```

3. **Access the application:**
   - **Frontend**: http://localhost:5173
   - **Backend API**: http://localhost:8000
   - **API Docs**: http://localhost:8000/api/docs

## 📚 API Documentation

### Authentication Endpoints
```
POST /api/auth/signup          - Create new account
POST /api/auth/login           - Login with email/password
```

### User Endpoints
```
GET  /api/users/me             - Get current user profile
GET  /api/users/{user_id}      - Get user by ID
PUT  /api/users/me             - Update profile
GET  /api/users/profile/me     - Get extended profile with stats
```

### Song Endpoints
```
GET  /api/songs                - Get all songs (paginated)
GET  /api/songs/{song_id}      - Get song details
GET  /api/songs/search         - Search songs
GET  /api/songs/genre/{genre}  - Get songs by genre
GET  /api/songs/trending       - Get trending songs
GET  /api/songs/{song_id}/stream - Stream song audio
POST /api/songs                - Create new song
POST /api/songs/{song_id}/upload-audio - Upload audio file
POST /api/songs/{song_id}/upload-thumbnail - Upload thumbnail
```

### Playlist Endpoints
```
GET  /api/playlists            - Get user's playlists
GET  /api/playlists/{id}       - Get playlist details
POST /api/playlists            - Create new playlist
PUT  /api/playlists/{id}       - Update playlist
DELETE /api/playlists/{id}     - Delete playlist
POST /api/playlists/{id}/songs - Add song to playlist
DELETE /api/playlists/{id}/songs/{song_id} - Remove song from playlist
```

### Favorites Endpoints
```
GET  /api/favorites            - Get favorite songs
POST /api/favorites            - Add song to favorites
DELETE /api/favorites/{song_id} - Remove from favorites
GET  /api/favorites/{song_id}/check - Check if song is favorited
```

### Recently Played Endpoints
```
GET  /api/recently-played      - Get recently played songs
POST /api/recently-played/{song_id} - Add to recently played
```

## 📁 Project Structure

```
spotify-clone/
├── Backend/
│   ├── app/
│   │   ├── models/         # SQLAlchemy models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── routers/        # API route handlers
│   │   ├── services/       # Business logic
│   │   └── auth/           # Authentication logic
│   ├── main.py            # FastAPI app entry point
│   ├── config.py          # Configuration
│   ├── database.py        # Database setup
│   ├── requirements.txt   # Python dependencies
│   ├── .env               # Environment variables
│   └── Dockerfile         # Docker configuration
│
├── Frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API service layer
│   │   ├── stores/        # Zustand state stores
│   │   ├── styles/        # Global styles
│   │   ├── App.jsx        # Root app component
│   │   └── main.jsx       # Entry point
│   ├── public/            # Static files
│   ├── package.json       # NPM dependencies
│   ├── vite.config.js     # Vite configuration
│   ├── tailwind.config.js # Tailwind configuration
│   ├── .env               # Environment variables
│   └── Dockerfile         # Docker configuration
│
├── docker-compose.yml     # Docker Compose setup
└── README.md             # Project documentation
```

## 🔐 Security Considerations

- ✅ Passwords are hashed with bcrypt
- ✅ JWT tokens for stateless authentication
- ✅ CORS configured for safe cross-origin requests
- ✅ Input validation with Pydantic
- ✅ Protected routes with authentication checks
- ✅ Environment variables for sensitive data

### For Production:
- Change `SECRET_KEY` to a strong random string
- Use HTTPS/TLS
- Set `CORS_ORIGINS` to your specific domains
- Use PostgreSQL instead of SQLite
- Enable rate limiting
- Implement request logging
- Use environment-specific settings

## 🎨 Customization

### Theming
Edit `Frontend/tailwind.config.js` to customize colors:
```javascript
colors: {
  spotify: {
    dark: '#121212',
    darker: '#0f0f0f',
    accent: '#1DB954',  // Change to your brand color
    gray: '#282828',
  }
}
```

### Configuration
Edit `Backend/.env` and `Frontend/.env` to configure:
- Database connection
- API endpoints
- Upload limits
- JWT expiration
- CORS settings

## 📦 Building for Production

### Backend
```bash
cd Backend
# Build Docker image
docker build -t spotify-clone-backend .

# Run container
docker run -p 8000:8000 spotify-clone-backend
```

### Frontend
```bash
cd Frontend
# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to hosting (Netlify, Vercel, etc.)
```

## 🧪 Testing the Application

### Default Test User
Create a test account:
1. Go to http://localhost:5173/signup
2. Fill in the registration form
3. Login with your credentials

### Sample Songs
To test with sample songs:
1. Create a few sample files or use existing Kannada songs
2. Use the API to upload them
3. Test the player and features

## 📝 API Examples

### Register User
```bash
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "kannada_lover",
    "password": "securepassword123",
    "full_name": "Kannada Lover"
  }'
```

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword123"
  }'
```

### Search Songs
```bash
curl -X GET "http://localhost:8000/api/songs/search?q=yaarige" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🐛 Troubleshooting

### Backend Issues
- **Port already in use**: Change port in `main.py` or kill process on port 8000
- **Database locked**: Delete `spotify_clone.db` and restart
- **Import errors**: Ensure virtual environment is activated and dependencies installed

### Frontend Issues
- **API connection refused**: Ensure backend is running on port 8000
- **Module not found**: Run `npm install` in Frontend directory
- **Port 5173 in use**: Change port in `vite.config.js`

## 🚀 Deployment

### Deploy Backend to Heroku
```bash
heroku create spotify-clone-backend
git push heroku main
```

### Deploy Frontend to Vercel
```bash
npm i -g vercel
vercel
```

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit Pull Requests.

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review API documentation at `/api/docs`
3. Check console logs for error messages

## 🎯 Future Enhancements

- [ ] Social features (follow users, share playlists)
- [ ] Advanced recommendations based on listening history
- [ ] Lyrics display with sync
- [ ] Multiple language support
- [ ] Offline mode
- [ ] Podcast support
- [ ] Live radio features
- [ ] Social media integration
- [ ] Payment integration for premium features
- [ ] Analytics dashboard

---

**Happy Streaming! 🎵**
