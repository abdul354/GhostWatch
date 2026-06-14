# GhostWatch

> **Turning silent seas into actionable rescue missions.**

[![CI](https://github.com/abdul354/GhostWatch/actions/workflows/ci.yml/badge.svg)](https://github.com/abdul354/GhostWatch/actions/workflows/ci.yml)
![Hackathon](https://img.shields.io/badge/Microsoft%20Agent%20League-Reasoning%20Agents-0078D4?style=for-the-badge)
![Frontend](https://img.shields.io/badge/Frontend-Next.js%20%2B%20React-000000?style=for-the-badge&logo=nextdotjs)
![Backend](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi)
![Status](https://img.shields.io/badge/Demo%20Mode-Keyless%20Fallback-brightgreen?style=for-the-badge)

GhostWatch is a reasoning-powered marine conservation dashboard that turns AIS silence, ocean drift, and biodiversity risk into mission-ready response briefs.

Every year, abandoned fishing gear drifts unseen through the ocean, trapping marine life and damaging fragile habitats. Response teams often face the same problem: too much scattered data, too little time, and no clear next action. GhostWatch bridges that gap with a tactical dashboard and a deterministic reasoning agent that ranks incidents, explains the evidence, and recommends what to do next.

## Why It Matters

Ghost gear is one of the ocean's most preventable threats, but locating it is hard. A suspicious AIS gap may be harmless. A drifting net may move kilometers before a crew arrives. A response zone may overlap with vulnerable marine species. GhostWatch combines those signals into a single operational picture.

## Built For

| Track | Fit |
| --- | --- |
| Microsoft Agent League | Reasoning Agents |
| Primary user | Marine conservation teams, patrol operators, cleanup coordinators |
| Core job | Convert uncertain maritime signals into ranked response plans |
| Demo posture | Runs without external API keys using deterministic fallback data |

## Core Capabilities

- **Reasoning Agent Briefs**: ranks AIS incidents by risk and explains the signal chain.
- **AIS Gap Intelligence**: detects suspicious vessel silence windows with mock-safe GFW integration.
- **Drift Projection**: estimates where debris or ghost gear may travel based on ocean current vectors.
- **Biodiversity Context**: queries OBIS species data from the frontend to show potential ecological risk.
- **Mission Dashboard**: presents response priorities in a high-contrast tactical interface.
- **Keyless Demo Mode**: runs locally without Azure, GFW, or Copernicus credentials.

## How The Reasoning Works

```text
AIS gap signal
    +
Vessel metadata
    +
Projected drift path
    +
Risk scoring rules
    =
Ranked intervention brief
```

The current reasoning layer is deterministic by design. That means judges and teammates can run the demo reliably without cloud quota or paid API keys. The backend also includes an optional Azure AI Foundry handoff: when Foundry environment variables are present, the same structured `/reasoning-brief` can be sent to a model deployment for natural-language mission planning.

## Architecture

```text
frontend/
  Next.js app
  Tactical dashboard UI
  OBIS client-side species lookup

backend/
  FastAPI service
  AIS gap mock/live interface
  Drift projection utilities
  Reasoning agent brief builder
```

## Tech Stack

| Layer | Tools |
| --- | --- |
| Frontend | Next.js, React, Tailwind CSS, Framer Motion, Lucide |
| Backend | FastAPI, Pydantic, NumPy, Pytest |
| Data signals | AIS/GFW-style vessel gaps, Copernicus-style drift currents, OBIS biodiversity |
| Agent layer | Deterministic reasoning brief, optional Azure AI Foundry planning handoff |

## Quick Start

Prerequisites:

- Node.js 18+
- Python 3.10+ recommended, Python 3.12 used locally
- npm

### Backend

Windows PowerShell:

```powershell
cd "C:\Users\Lenovo\Desktop\New folder\GhostWatch\backend"
.\.venv\Scripts\activate
python.exe -m uvicorn main:app --host 127.0.0.1 --port 8000
```

Create the venv first if it does not exist:

```powershell
cd "C:\Users\Lenovo\Desktop\New folder\GhostWatch\backend"
python -m venv .venv
.\.venv\Scripts\activate
python.exe -m pip install -r requirements.txt
```

Backend health check:

```text
http://127.0.0.1:8000/health
```

### Frontend

Windows PowerShell:

```powershell
cd "C:\Users\Lenovo\Desktop\New folder\GhostWatch\frontend"
.\node_modules\.bin\next.cmd dev -p 3000
```

Install frontend dependencies first if needed:

```powershell
cd "C:\Users\Lenovo\Desktop\New folder\GhostWatch\frontend"
npm install
```

Open:

```text
http://localhost:3000
```

Use `localhost`, not the network URL, during development. The backend CORS policy is configured for `localhost:3000` and `127.0.0.1:3000`.

## API Endpoints

| Method | Path | Description |
| --- | --- | --- |
| GET | `/health` | Backend health check |
| POST | `/reasoning-brief` | Ranked incident brief from AIS gaps and drift projection |
| POST | `/drift` | Project a drift path from a starting point |
| GET | `/drift-demo` | Deterministic drift demo |
| POST | `/ais-gaps` | Query AIS vessel gap detections |

### Reasoning Brief Example

```powershell
$body = '{
  "min_lat": 10,
  "max_lat": 20,
  "min_lon": 80,
  "max_lon": 90,
  "start_date": "2026-05-01",
  "end_date": "2026-06-07",
  "limit": 3,
  "use_mock": true
}'

Invoke-WebRequest `
  -Uri http://127.0.0.1:8000/reasoning-brief `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

Example output shape:

```json
{
  "agent": "GhostWatch Reasoning Agent",
  "mode": "deterministic",
  "summary": "Sea Lantern is the top intervention target...",
  "incidents": [
    {
      "rank": 1,
      "priority": "critical",
      "risk_score": 0.99,
      "signals": [
        "AIS silence lasted 18.4 hours",
        "Projected drift displacement is 11.7 km",
        "AIS silence inside protected corridor"
      ],
      "recommended_action": "Dispatch recovery crew and request vessel identity review."
    }
  ]
}
```

## Optional Live Data

GhostWatch runs without external credentials. For richer live integrations, copy `backend/.env.example` to `backend/.env` and add credentials:

```env
COPERNICUS_USERNAME=""
COPERNICUS_PASSWORD=""
GFW_API_TOKEN=""
```

Current behavior:

- If Copernicus credentials are missing, drift uses deterministic seeded currents.
- If GFW live access is unavailable, AIS gap detection uses realistic mock data.
- OBIS biodiversity lookup is performed client-side and does not require an API key.

## Azure AI Foundry Integration

The reasoning endpoint already returns a structured agent brief and a Foundry integration status. With no keys configured, it stays in local fallback mode. With Foundry variables configured, the backend can call an Azure AI Foundry model deployment for narrative planning:

```text
/reasoning-brief response
    ->
Azure AI Foundry model
    ->
Crew-ready natural language intervention plan
```

Foundry IQ can be added later for document-grounded context such as marine protection policies, cleanup SOPs, local harbor contacts, or incident reports.

Optional Foundry variables live in `backend/.env.example`:

```env
AZURE_AI_FOUNDRY_ENDPOINT=""
AZURE_AI_FOUNDRY_DEPLOYMENT=""
AZURE_AI_FOUNDRY_API_VERSION=""
AZURE_AI_FOUNDRY_API_KEY=""
```

## Test And Build

Backend tests:

```powershell
cd "C:\Users\Lenovo\Desktop\New folder\GhostWatch\backend"
.\.venv\Scripts\python.exe -m pytest -q
```

Frontend production build:

```powershell
cd "C:\Users\Lenovo\Desktop\New folder\GhostWatch\frontend"
npm run build
```

## Project Status

| Area | Status |
| --- | --- |
| Tactical frontend | Working |
| Backend API | Working |
| Reasoning brief endpoint | Working |
| Mock AIS data | Working |
| Drift projection | Working |
| OBIS lookup | Working client-side |
| Live GFW integration | Planned |
| Azure AI Foundry model layer | Optional handoff integrated |
| Foundry IQ knowledge grounding | Planned |

## Submission Pitch

GhostWatch transforms maritime uncertainty into conservation action. It watches for dark vessel behavior, estimates where ghost gear may drift, weighs ecological risk, and generates a ranked mission brief that response teams can act on immediately.

It is not just a dashboard. It is a reasoning layer for the ocean.
