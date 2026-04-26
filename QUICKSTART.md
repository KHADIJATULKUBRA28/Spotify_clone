# Quick Start Guide

Get the Spotify Clone running in 5 minutes!

## Prerequisites Check

✅ Python 3.11+
✅ Node.js 18+
✅ npm or yarn

## Step 1: Backend (Terminal 1)

```bash
cd Backend
python -m venv env

# Windows
env\Scripts\activate
# macOS/Linux
source env/bin/activate

pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

**Wait for:** `Uvicorn running on http://0.0.0.0:8000`

## Step 2: Frontend (Terminal 2)

```bash
cd Frontend
npm install
npm run dev
```

**Wait for:** `Local: http://localhost:5173/`

## Step 3: Access Application

Open your browser:
- **Frontend**: http://localhost:5173
- **API Docs**: http://localhost:8000/api/docs

## Step 4: Create Account & Test

1. Click "Sign Up"
2. Fill in the form
3. Explore the features!

---

## 🎯 Key Endpoints

| Feature | Endpoint |
|---------|----------|
| API Docs | http://localhost:8000/api/docs |
| Frontend | http://localhost:5173 |
| Health Check | http://localhost:8000/health |

---

## 🚀 Next Steps

- Explore [SETUP.md](SETUP.md) for detailed instructions
- Check [API.md](API.md) for API documentation
- See [README.md](README.md) for full features and customization

---

**That's it! Happy streaming! 🎵**
