# AspirePrep Backend — FastAPI (Python) & React

This project features a high-performance **FastAPI (Python)** backend and a modern **React (Vite)** frontend for AI-powered exam preparation.

---

## 🐍 1. Python FastAPI Backend Setup

### Prerequisites
- Python 3.10+
- pip

### Installation & Run
```bash
# Navigate to the backend directory
cd backend

# Create and activate a virtual environment (optional but recommended)
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Start the FastAPI Uvicorn development server
python main.py
# Or directly via Uvicorn:
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Interactive API Documentation
Once running, open your browser:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

---

## ⚛️ 2. React Frontend Setup

### Prerequisites
- Node.js 18+
- npm

### Installation & Run
```bash
# Navigate to the frontend directory
cd frontend

# Install Node dependencies
npm install

# Start the React Vite dev server
npm run dev
```

The frontend will run on `http://localhost:3000` (or `http://localhost:5173`) and connect to the FastAPI backend at `/api` (or configured via `VITE_API_URL=http://localhost:8000/api` in `.env`).

---

## 📁 API Endpoints Overview

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status |
| `POST` | `/api/auth/register` | Aspirant registration |
| `POST` | `/api/auth/login` | Aspirant authentication |
| `GET` | `/api/exams` | List competitive and government exams |
| `GET` | `/api/mock-tests` | Full-length mock test papers |
| `POST` | `/api/mock-tests/submit` | Evaluate test submission & ranks |
| `POST` | `/api/study-plan/analyze-notes` | NLP syllabus extraction & scheduling |
| `POST` | `/api/ai-tutor/chat` | 24/7 AI tutor powered by Gemini |
| `GET` | `/api/university/subjects` | 5-unit university syllabus blueprints |
| `POST` | `/api/video/generate` | 3D concept visualization via Veo |
