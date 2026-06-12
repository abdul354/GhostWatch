# GhostWatch — Marine Conservation Tactical Dashboard

[![CI](https://github.com/abdul354/GhostWatch/actions/workflows/ci.yml/badge.svg)](https://github.com/abdul354/GhostWatch/actions/workflows/ci.yml)

A Next.js + FastAPI dashboard for monitoring marine conservation missions. Tracks ghost gear sightings, AIS vessel gaps, and OBIS species data in near-real-time.

## Layout

- `frontend/` - Next.js dashboard app
- `backend/` - FastAPI API, drift utilities, and tests

## Tech stack

**Frontend:** Next.js, React, Tailwind CSS, Framer Motion
**Backend:** FastAPI, NumPy, Pydantic
**Data sources:** OBIS (species), GFW/AIS (vessel tracking)

## Quick start

Prerequisites: Node.js (18+), Python 3.10+, npm or pnpm.

### Frontend (`frontend/`)

```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:3000 in your browser.

### Backend (`backend/`)

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python3 -m uvicorn main:app --host 127.0.0.1 --port 8000
```

The frontend gracefully falls back to mock data when the backend is offline.

## Project structure

```
frontend/
  app/                      — Next.js app router entrypoints
  components/               — UI sections, cards, and forms
  public/                   — static assets
  next.config.mjs           — Next.js configuration
  package.json              — frontend scripts and dependencies
backend/
  main.py                   — FastAPI app: /health, /drift, /drift-demo, /ais-gaps
  drift_calculator.py       — ocean drift path projection
  gfw_query.py              — AIS gap detection (mock fallback when no GFW key)
  requirements.txt          — Python dependencies
  tests/                    — backend pytest suite
```

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| POST | `/drift` | Project drift path from origin point |
| POST | `/ais-gaps` | Query AIS vessel gap detections |

### `/ais-gaps` request body

```json
{
  "min_lat": 10.0,
  "max_lat": 20.0,
  "min_lon": 80.0,
  "max_lon": 90.0,
  "start_date": "2026-05-01",
  "end_date": "2026-06-07",
  "limit": 5,
  "use_mock": true
}
```

Set `use_mock: false` and provide a `GFW_API_KEY` environment variable to query live GFW data.
To enable Copernicus surface currents for `/drift`, create `backend/.env` from `backend/.env.example` with `COPERNICUS_USERNAME` and `COPERNICUS_PASSWORD`, then restart the backend.

## Development notes

- The site uses Tailwind utility classes. Run Tailwind IntelliSense for class suggestions.
- OBIS species lookups run client-side (no API key required).
- When running the dev server, Next.js logs the local URL (http://localhost:3000).
- The backend CORS policy restricts origins to `localhost:3000` and `127.0.0.1:3000`.
- To use live Copernicus currents: set `COPERNICUS_USERNAME` and `COPERNICUS_PASSWORD` in `backend/.env` (see `backend/.env.example`). If set, `/drift` will attempt to fetch surface currents for the given `start_date`; otherwise it falls back to a deterministic seeded mock for reproducible testing.
