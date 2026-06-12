# GhostWatch — Marine Conservation Tactical Dashboard

A Next.js + FastAPI dashboard for monitoring marine conservation missions. Tracks ghost gear sightings, AIS vessel gaps, and OBIS species data in near-real-time.

## Tech stack

**Frontend:** Next.js, React, Tailwind CSS, Framer Motion
**Backend:** FastAPI, NumPy, Pydantic
**Data sources:** OBIS (species), GFW/AIS (vessel tracking)

## Quick start

Prerequisites: Node.js (18+), Python 3.10+, npm or pnpm.

### Frontend

```bash
npm install
npm run dev
```
Open http://localhost:3000 in your browser.

### Backend

```bash
pip install -r requirements.txt
python3 -m uvicorn main:app --host 127.0.0.1 --port 8000
```

The frontend gracefully falls back to mock data when the backend is offline.

## Project structure

```
app/
  page.tsx                  — main page layout
components/
  cards/mission-brief-card.tsx   — mission card with OBIS species data
  forms/gear-report-form.tsx     — field report form for ghost gear sightings
  sections/features-section.tsx  — AIS gap dashboard (calls /ais-gaps)
  sections/report-section.tsx    — hosts the gear report form
  ui/                          — shadcn/ui component library
main.py                   — FastAPI app: /health, /drift, /ais-gaps
drift_calculator.py       — ocean drift path projection
gfw_query.py              — AIS gap detection (mock fallback when no GFW key)
requirements.txt          — Python dependencies
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
To enable Copernicus surface currents for `/drift`, create a `.env` (from `.env.example`) with `COPERNICUS_USERNAME` and `COPERNICUS_PASSWORD`, then restart the backend.

## Development notes

- The site uses Tailwind utility classes. Run Tailwind IntelliSense for class suggestions.
- OBIS species lookups run client-side (no API key required).
- When running the dev server, Next.js logs the local URL (http://localhost:3000).
- The backend CORS policy restricts origins to `localhost:3000` and `127.0.0.1:3000`.
 - To use live Copernicus currents: set `COPERNICUS_USERNAME` and `COPERNICUS_PASSWORD` in a local `.env` (see `.env.example`). If set, `/drift` will attempt to fetch surface currents for the given `start_date`; otherwise it falls back to a deterministic seeded mock for reproducible testing.
