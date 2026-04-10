# Setup & Installation Guide

Detailed step-by-step instructions to get the Kannada Spotify Clone running on your machine.

## System Requirements

- **OS**: Windows, macOS, or Linux
- **Python**: 3.11 or higher
- **Node.js**: 18 or higher
- **npm**: 9 or higher or yarn
- **RAM**: Minimum 2GB free
- **Storage**: Minimum 500MB free

## Installation Steps

### Step 1: Clone or Download the Repository

```bash
# Clone the repository
git clone <repository-url>
cd spotify-clone

# Or download and extract the zip file
# Then navigate to the extracted folder
cd spotify-clone
```

### Step 2: Backend Setup

#### 2.1 Create Virtual Environment

**Windows:**
```bash
cd Backend
python -m venv env
env\Scripts\activate
```

**macOS/Linux:**
```bash
cd Backend
python3 -m venv env
source env/bin/activate
```

#### 2.2 Install Dependencies

```bash
pip install -r requirements.txt
```

If you encounter any issues, try:
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

#### 2.3 Configure Environment Variables

Create a `.env` file in the `Backend` directory:

**Windows:**
```cmd
echo DATABASE_URL=sqlite:///./spotify_clone.db > .env
echo SECRET_KEY=your-super-secret-key-change-this-in-production >> .env
echo ALGORITHM=HS256 >> .env
echo ACCESS_TOKEN_EXPIRE_MINUTES=30 >> .env
echo CORS_ORIGINS=["http://localhost:5173","http://127.0.0.1:5173"] >> .env
```

**macOS/Linux:**
```bash
cat > .env << 'EOF'
DATABASE_URL=sqlite:///./spotify_clone.db
SECRET_KEY=your-super-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
CORS_ORIGINS=["http://localhost:5173","http://127.0.0.1:5173"]
EOF
```

Or edit manually:
```
DATABASE_URL=sqlite:///./spotify_clone.db
SECRET_KEY=your-super-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
CORS_ORIGINS=["http://localhost:5173","http://127.0.0.1:5173"]
```

#### 2.4 Create Uploads Directory

```bash
mkdir uploads
```

#### 2.5 Start Backend Server

```bash
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

You should see:
```
Uvicorn running on http://0.0.0.0:8000
```

**Backend is now running!** ✅
- API: http://localhost:8000
- Swagger Docs: http://localhost:8000/api/docs
- ReDoc: http://localhost:8000/api/redoc

### Step 3: Frontend Setup

#### 3.1 Open New Terminal and Navigate to Frontend

```bash
# From the root spotify-clone directory
cd Frontend
```

#### 3.2 Install Dependencies

```bash
npm install
```

If using yarn:
```bash
yarn install
```

This will take a few minutes. Get some ☕!

#### 3.3 Configure Environment Variables

Create `.env` file in the `Frontend` directory:

**Windows:**
```cmd
echo VITE_API_BASE_URL=http://localhost:8000 > .env
echo VITE_APP_NAME=Kannada Spotify Clone >> .env
```

**macOS/Linux:**
```bash
cat > .env << 'EOF'
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_NAME=Kannada Spotify Clone
EOF
```

#### 3.4 Start Frontend Development Server

```bash
npm run dev
```

You should see:
```
VITE v5.0.2  ready in 123 ms

➜  Local:   http://localhost:5173/
```

**Frontend is now running!** ✅
- Application: http://localhost:5173

---

## 🎉 Both Servers are Running!

Now you can access:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/api/docs

---

## Testing the Application

### 1. Create an Account

1. Go to http://localhost:5173
2. Click "Sign up"
3. Fill in the form with:
   - Email: test@example.com
   - Username: testuser
   - Password: TestPassword123
   - Full Name: Test User (optional)
4. Click "Sign Up"

### 2. Login

1. You should be redirected to the login page or logged in automatically
2. If not, go to http://localhost:5173/login
3. Enter your credentials

### 3. Explore Features

- **Home**: Browse and discover songs
- **Search**: Search for songs by title, artist, or album
- **Playlists**: Create and manage playlists
- **Favorites**: Mark songs as favorites
- **Player**: Play songs and control playback

---

## Adding Sample Songs

### Option 1: Using the API Directly

```bash
# First get an access token by logging in
# Then use curl to add songs

curl -X POST http://localhost:8000/api/songs \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Yaarige",
    "artist": "Hamsalekshmi",
    "album": "Kannada Collection",
    "genre": "Kannada",
    "duration": 240,
    "description": "A beautiful Kannada song",
    "lyrics": "Yaarige nee bandha...\n"
  }'
```

### Option 2: Using Postman

1. Open Postman
2. Create a new POST request to `http://localhost:8000/api/songs`
3. Add Authorization header with Bearer token
4. Add JSON body with song data
5. Send the request

---

## Docker Setup (Optional)

If you prefer using Docker:

### Prerequisites

- Docker installed: https://www.docker.com/products/docker-desktop
- Docker Compose installed (included with Docker Desktop)

### Run with Docker

```bash
# From the project root
docker-compose up --build
```

This will start both Frontend and Backend automatically!

Access:
- Frontend: http://localhost:5173
- Backend: http://localhost:8000

To stop:
```bash
docker-compose down
```

---

## Production Build

### Build Backend for Production

```bash
cd Backend
docker build -t my-spotify-backend .
docker run -p 8000:8000 my-spotify-backend
```

### Build Frontend for Production

```bash
cd Frontend
npm run build
npm run preview
```

Or deploy the `dist/` folder to:
- Vercel: https://vercel.com
- Netlify: https://netlify.com
- GitHub Pages: https://pages.github.com

---

## Troubleshooting

### Backend Issues

**Error: "Port 8000 already in use"**
```bash
# Find and kill process on port 8000
netstat -ano | findstr :8000  # Windows
lsof -i :8000                 # macOS/Linux
```

**Error: "Module not found"**
```bash
# Ensure virtual environment is activated
# Windows
env\Scripts\activate
# macOS/Linux
source env/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

**Error: "Database is locked"**
```bash
# Delete database and restart
rm spotify_clone.db
python -m uvicorn main:app --reload
```

### Frontend Issues

**Error: "Cannot find module"**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

**Error: "Port 5173 already in use"**
```bash
# Kill process on port 5173
netstat -ano | findstr :5173  # Windows
lsof -i :5173                 # macOS/Linux
```

---

## Environment Variables Reference

### Backend (.env)

| Variable | Default | Description |
|----------|---------|-------------|
| DATABASE_URL | sqlite:///./spotify_clone.db | Database connection string |
| SECRET_KEY | (required) | JWT secret key for token signing |
| ALGORITHM | HS256 | JWT algorithm |
| ACCESS_TOKEN_EXPIRE_MINUTES | 30 | Token expiration time |
| CORS_ORIGINS | ["http://localhost:5173"] | Allowed origins for CORS |
| UPLOAD_DIRECTORY | ./uploads | Directory for file uploads |
| MAX_UPLOAD_SIZE | 104857600 | Max file size in bytes (100MB) |
| USE_S3 | false | Use AWS S3 for storage |

### Frontend (.env)

| Variable | Default | Description |
|----------|---------|-------------|
| VITE_API_BASE_URL | http://localhost:8000 | Backend API URL |
| VITE_APP_NAME | Kannada Spotify Clone | Application name |

---

## Development Tips

### Useful Commands

**Backend**
```bash
# Run with auto-reload
python -m uvicorn main:app --reload

# Run with logging
python -m uvicorn main:app --reload --log-level debug

# Create fresh database
rm spotify_clone.db
python -m uvicorn main:app --reload
```

**Frontend**
```bash
# Development with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## Next Steps

1. Create test accounts and explore features
2. Upload sample Kannada songs
3. Create playlists and add songs
4. Test player functionality
5. Customize styling and branding
6. Deploy to production

---

## Support & Documentation

- **API Documentation**: http://localhost:8000/api/docs
- **Swagger UI**: http://localhost:8000/api/redoc
- **Project README**: See README.md for full documentation
- **FastAPI Docs**: https://fastapi.tiangolo.com/
- **React Docs**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com

---

**Happy coding! 🚀**
