# 🗺️ RouteAI — AI-Powered Route Optimization

> Sort addresses from nearest to farthest using GPS + Haversine algorithm. Built for the modern logistics era.

![RouteAI](https://img.shields.io/badge/RouteAI-v1.0.0-7c3aed?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2-61dafb?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-68a063?style=flat-square&logo=node.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?style=flat-square&logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-5.7-5a67d8?style=flat-square&logo=prisma)

---

## 📋 Table of Contents

1. [Description](#description)
2. [Features](#features)
3. [Prerequisites](#prerequisites)
4. [Project Structure](#project-structure)
5. [Local Development Setup](#local-development-setup)
6. [Environment Variables](#environment-variables)
7. [Deploy to Vercel (Frontend)](#deploy-to-vercel-frontend)
8. [Deploy to Railway (Backend + Database)](#deploy-to-railway-backend--database)
9. [API Documentation](#api-documentation)

---

## Description

**RouteAI** is a waitlist web application featuring AI-powered address sorting. Using the browser's Geolocation API combined with the Haversine formula, it calculates distances from the user's GPS position and displays addresses sorted from nearest to farthest in an interactive leaderboard. Clicking any address opens it directly in Google Maps.

**Key capabilities:**
- 📍 Real-time GPS detection via browser Geolocation API
- 🤖 Haversine distance calculation (accurate great-circle distance)
- 🏆 Interactive leaderboard with gold/silver/bronze medals
- 🗺️ One-click Google Maps navigation
- 📝 Waitlist registration with duplicate prevention
- 📊 Live registration counter

---

## Features

| Feature | Description |
|---|---|
| GPS Detection | Browser Geolocation API with accuracy reporting |
| Distance Sorting | Haversine formula on both frontend and backend |
| Leaderboard | Animated rows with 🥇🥈🥉 medals |
| Google Maps | Click any row → opens `maps.google.com/search` |
| Waitlist Form | Name + email, validates & prevents duplicates |
| Live Counter | Real-time count of waitlist registrations |
| Dark Mode | Full dark theme, background `#0a0a0f` |
| Particle Animation | Interactive particle canvas in hero section |
| Mobile Responsive | Works on all screen sizes |

---

## Prerequisites

Ensure these are installed before proceeding:

- **Node.js** v18.0.0 or higher — [Download](https://nodejs.org/)
- **npm** v9+ (comes with Node.js)
- **PostgreSQL** v14 or higher — [Download](https://www.postgresql.org/download/)
- **Git** — [Download](https://git-scm.com/)

Verify your setup:
```bash
node --version    # Should be >= 18.0.0
npm --version     # Should be >= 9.0.0
psql --version    # Should be >= 14
```

---

## Project Structure

```
RouteAI/
├── frontend/                    # React + Vite app
│   ├── src/
│   │   ├── components/
│   │   │   ├── Hero.jsx         # Landing section with particle animation
│   │   │   ├── WaitlistForm.jsx # Registration form
│   │   │   ├── Leaderboard.jsx  # GPS-sorted address list
│   │   │   ├── FeatureCards.jsx # Product features grid
│   │   │   └── Footer.jsx       # Footer with links
│   │   ├── App.jsx              # Root component + GPS state
│   │   ├── main.jsx             # React entry point
│   │   └── index.css            # Global styles + Tailwind
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vercel.json              # Vercel deployment config
│
├── backend/                     # Node.js + Express API
│   ├── src/
│   │   ├── routes/
│   │   │   ├── waitlist.js      # Waitlist CRUD + count
│   │   │   └── addresses.js     # Address CRUD + sort by distance
│   │   ├── middleware/
│   │   │   └── cors.js          # CORS configuration
│   │   └── index.js             # Express app entry point
│   ├── prisma/
│   │   ├── schema.prisma        # Database schema
│   │   └── seed.js              # Seed 5 Jakarta landmarks
│   ├── package.json
│   ├── .env.example             # Environment variable template
│   └── railway.toml             # Railway deployment config
│
└── README.md
```

---

## Local Development Setup

### Step 1: Clone the repository

```bash
git clone https://github.com/your-username/routeai.git
cd routeai
```

### Step 2: Set up the PostgreSQL database

```bash
# Create a new database
psql -U postgres -c "CREATE DATABASE routeai;"

# Or using psql interactive mode:
psql -U postgres
postgres=# CREATE DATABASE routeai;
postgres=# \q
```

### Step 3: Set up the Backend

```bash
cd backend

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Copy and configure environment variables
cp .env.example .env
```

Edit `backend/.env`:
```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/routeai?schema=public"
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

```bash
# Run database migrations
npx prisma migrate dev --name init

# Seed the database with 5 Jakarta landmarks
npm run db:seed

# Start the backend server
npm run dev
```

Backend will be running at: **http://localhost:5000**

Test with: `curl http://localhost:5000/health`

### Step 4: Set up the Frontend

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install
```

Create `frontend/.env.local`:
```env
VITE_API_URL=http://localhost:5000
```

```bash
# Start the frontend dev server
npm run dev
```

Frontend will be running at: **http://localhost:3000**

### Step 5: Verify everything works

1. Open http://localhost:3000
2. Click **"Deteksi Lokasi Saya"** — allow browser location access
3. Leaderboard should show addresses sorted by distance
4. Click any row → Google Maps should open
5. Fill the waitlist form → check counter updates

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description | Example |
|---|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `PORT` | ❌ | Server port (default: 5000) | `5000` |
| `NODE_ENV` | ❌ | Environment | `development` or `production` |
| `FRONTEND_URL` | ❌ | Allowed CORS origin | `https://routeai.vercel.app` |

### Frontend (`frontend/.env.local`)

| Variable | Required | Description | Example |
|---|---|---|---|
| `VITE_API_URL` | ✅ | Backend API base URL | `https://routeai-api.up.railway.app` |

> ⚠️ Never commit `.env` files. Only `.env.example` should be in version control.

---

## Deploy to Vercel (Frontend)

### Option A: Vercel CLI (Recommended)

```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to frontend directory
cd frontend

# Deploy (follow prompts)
vercel

# For production deploy
vercel --prod
```

### Option B: Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repository
3. Set **Root Directory** to `frontend`
4. Configure **Environment Variables**:
   - `VITE_API_URL` = your Railway backend URL (e.g. `https://routeai-api.up.railway.app`)
5. Click **Deploy**

### Vercel Settings

| Setting | Value |
|---|---|
| Framework Preset | Vite |
| Root Directory | `frontend` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

---

## Deploy to Railway (Backend + Database)

### Step 1: Create a Railway account

Go to [railway.app](https://railway.app) and sign up with GitHub.

### Step 2: Deploy PostgreSQL Database

1. **New Project** → **Add Service** → **Database** → **PostgreSQL**
2. Railway provisions a PostgreSQL instance automatically
3. Click the PostgreSQL service → **Variables** tab
4. Copy the `DATABASE_URL` value (you'll need it in Step 4)

### Step 3: Deploy Backend

1. In the same Railway project → **Add Service** → **GitHub Repo**
2. Select your repository
3. Set **Root Directory** to `backend`
4. Railway will auto-detect Node.js and use `railway.toml`

### Step 4: Configure Environment Variables

In the backend Railway service → **Variables** tab, add:

| Key | Value |
|---|---|
| `DATABASE_URL` | Paste from PostgreSQL service (Step 2) |
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | Your Vercel URL (e.g. `https://routeai.vercel.app`) |
| `PORT` | Leave empty (Railway sets this automatically) |

### Step 5: Run Database Migration and Seed

In Railway backend service → **Settings** → **Deploy** section, the start command is already configured in `railway.toml`:

```toml
startCommand = "npm run db:migrate && npm start"
```

To seed the database, use Railway's **Shell** feature:
```bash
npm run db:seed
```

### Step 6: Update Frontend Environment Variable

Once Railway assigns a domain to your backend (e.g. `routeai-api.up.railway.app`):

1. Go to your Vercel project → **Settings** → **Environment Variables**
2. Update `VITE_API_URL` to `https://routeai-api.up.railway.app`
3. Redeploy the frontend

---

## API Documentation

Base URL: `http://localhost:5000` (dev) or `https://your-app.up.railway.app` (prod)

---

### Health Check

```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600.5,
  "env": "production"
}
```

---

### Waitlist Endpoints

#### Register to Waitlist

```http
POST /api/waitlist
Content-Type: application/json

{
  "name": "Budi Santoso",
  "email": "budi@example.com"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Successfully joined the waitlist!",
  "data": {
    "id": 1,
    "name": "Budi Santoso",
    "email": "budi@example.com",
    "position": 1,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error — Duplicate (409):**
```json
{
  "success": false,
  "message": "Email already registered in the waitlist."
}
```

---

#### Get Waitlist Count

```http
GET /api/waitlist/count
```

**Response (200):**
```json
{
  "success": true,
  "count": 42
}
```

---

#### Get All Waitlist Entries (Paginated)

```http
GET /api/waitlist?page=1&limit=20
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Budi Santoso",
      "email": "budi@example.com",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 42,
    "page": 1,
    "limit": 20,
    "totalPages": 3
  }
}
```

---

### Address Endpoints

#### Get All Addresses

```http
GET /api/addresses
```

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Monas",
    "address": "Monas, Jakarta Pusat",
    "lat": -6.1754,
    "lng": 106.8272,
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
]
```

---

#### Get Addresses Sorted by Distance

```http
GET /api/addresses/sort?lat=-6.2000&lng=106.8000
```

| Parameter | Type | Description |
|---|---|---|
| `lat` | float | User's latitude (-90 to 90) |
| `lng` | float | User's longitude (-180 to 180) |

**Response (200):**
```json
[
  {
    "id": 2,
    "name": "Bundaran HI",
    "address": "Bundaran HI, Jakarta Pusat",
    "lat": -6.1944,
    "lng": 106.8229,
    "distance": 0.72,
    "createdAt": "2024-01-15T10:00:00.000Z"
  },
  {
    "id": 1,
    "name": "Monas",
    "address": "Monas, Jakarta Pusat",
    "lat": -6.1754,
    "lng": 106.8272,
    "distance": 2.83,
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
]
```

> ✅ Addresses are sorted ascending by `distance` (nearest first). Distance is in **kilometers**.

---

#### Add New Address

```http
POST /api/addresses
Content-Type: application/json

{
  "name": "Grand Indonesia",
  "address": "Grand Indonesia, Jakarta Pusat",
  "lat": -6.1956,
  "lng": 106.8213
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Address added successfully.",
  "data": {
    "id": 6,
    "name": "Grand Indonesia",
    "address": "Grand Indonesia, Jakarta Pusat",
    "lat": -6.1956,
    "lng": 106.8213,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

#### Delete Address

```http
DELETE /api/addresses/:id
```

**Response (200):**
```json
{
  "success": true,
  "message": "Address deleted."
}
```

---

## 🏗️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend UI | React 18 + Vite 5 | SPA with fast HMR |
| Styling | Tailwind CSS 3 | Utility-first CSS |
| HTTP Client | Axios | API requests |
| Backend | Node.js 18 + Express 4 | REST API server |
| ORM | Prisma 5 | Type-safe DB access |
| Database | PostgreSQL 15 | Persistent storage |
| Frontend Deploy | Vercel | CDN + Edge network |
| Backend Deploy | Railway | Container + managed DB |

---

## 🧮 Haversine Formula

The core algorithm used to calculate great-circle distance between two GPS coordinates:

```
a = sin²(Δlat/2) + cos(lat1) × cos(lat2) × sin²(Δlng/2)
distance = 2R × arctan2(√a, √(1−a))
```

Where R = 6371 km (Earth's mean radius). This gives accuracy within ~0.3% for distances under 1000 km.

---

## 📝 License

MIT License — free to use, modify, and distribute.

---

Built with ❤️ for RouteAI
