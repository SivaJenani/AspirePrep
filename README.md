# AspirePrep — MERN Stack Exam Preparation Platform

A full-stack competitive exam preparation platform built with the **MERN** stack (MongoDB, Express, React, Node.js).

---

## 📁 Folder Structure

```
aspire-prep/
├── backend/                  # Express + Node.js + MongoDB API
│   ├── src/
│   │   ├── db/
│   │   │   ├── connect.ts          # MongoDB connection (Mongoose)
│   │   │   ├── store.ts            # In-memory store (dev/fallback)
│   │   │   ├── seedData.ts         # Exam/question seed data
│   │   │   └── universitySeedData.ts
│   │   ├── middleware/
│   │   │   └── auth.ts             # JWT authentication middleware
│   │   ├── models/
│   │   │   └── index.ts            # Mongoose schemas/models
│   │   ├── routes/
│   │   │   └── api.ts              # All API route handlers
│   │   ├── services/
│   │   │   └── aiService.ts        # Gemini AI service
│   │   ├── types/                  # Shared TypeScript types
│   │   └── server.ts               # Server entry point
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                 # React + Vite SPA
│   ├── src/
│   │   ├── components/             # Reusable UI components
│   │   ├── pages/                  # Page-level components
│   │   ├── store/                  # Zustand state management
│   │   ├── lib/                    # Utility functions
│   │   ├── data/                   # Static/local data
│   │   ├── types/                  # TypeScript type definitions
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts              # Vite config with /api proxy
│
├── data/                     # Persistent JSON database (dev fallback)
├── package.json              # Root orchestration scripts
└── README.md
```

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm run install:all
```

This installs packages for the root, backend, and frontend.

### 2. Configure Environment Variables

**Backend:**
```bash
cp backend/.env.example backend/.env
# Edit backend/.env and add your MONGODB_URI, JWT_SECRET, GEMINI_API_KEY
```

**Frontend:**
```bash
cp frontend/.env.example frontend/.env
```

### 3. Run in Development

```bash
# Run both frontend and backend simultaneously
npm run dev

# Or run separately:
npm run dev:backend    # starts on http://localhost:5000
npm run dev:frontend   # starts on http://localhost:5173
```

The frontend Vite dev server proxies `/api/*` requests to `http://localhost:5000`.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4 |
| State | Zustand |
| Backend | Node.js, Express 4, TypeScript |
| Database | MongoDB + Mongoose |
| Auth | JWT (jsonwebtoken) |
| AI | Google Gemini AI (`@google/genai`) |

---

## 📡 API Base URL

- **Development:** `http://localhost:5000/api`
- **Health Check:** `GET /api/health`
