# GhostWatch — Complete Build Guide
### Microsoft Agents League Hackathon 2026 | Reasoning Agents Track
**Team size:** 4 | **Deadline:** June 14, 2026, 11:59 PM PT | **Budget:** $0

---

## Part 0 — Read This First

This guide assumes you have **zero prior experience** with Microsoft Foundry, Azure, or any of the APIs involved. Every tool listed here is either completely free or covered by Microsoft's own student credits. Nothing requires a credit card charge. The build is designed so that each of your 4 team members owns one complete vertical — meaning if one person gets stuck, the other three keep moving.

**One critical truth about Azure for Students:** You each sign up individually using your university email. You each get **$100 in Azure credits** with **no credit card required**. That is $400 total across your team. The entire GhostWatch build will cost approximately $2–$5 in Azure tokens over a week of heavy testing. You will not run out.

---

## Part 1 — Accounts to Create (Day 1, ~2 hours total)

Do all of these on Day 1. Some take time to verify.

### 1.1 Azure for Students (all 4 team members)
**Cost:** Free | **Credit card:** Not required
**URL:** https://azure.microsoft.com/en-us/free/students

Steps:
1. Go to the URL above
2. Click "Activate now"
3. Sign in with your university (.edu or .ac) email address
4. Complete the student verification (instant for most universities)
5. You now have $100 in Azure credits, valid for 12 months
6. Go to portal.azure.com to confirm your subscription is active

> **Tip:** If your university email isn't recognised, use the GitHub Student Developer Pack route (github.com/education/students) — it gives the same Azure credits via a different verification path.

### 1.2 Microsoft Foundry (1 team member sets up, shares access)
**Cost:** Covered by Azure for Students credits
**URL:** https://ai.azure.com

Steps:
1. Sign in with the Azure for Students account
2. Click "Create a project"
3. Name it: GhostWatch
4. Select the free region closest to you (East US or West Europe)
5. Once created, go to Settings → Access Control → Add your teammates' Microsoft emails as Contributors

> **What Foundry gives you:** The AI brain of your agent. You'll use it to set up the reasoning loop, connect tools, and deploy the agent endpoint. Think of it as the "nerve centre" where all the intelligence lives.

### 1.3 Global Fishing Watch API (1 team member registers, shares token)
**Cost:** Completely free | **Credit card:** Not required
**URL:** https://globalfishingwatch.org/our-apis/

Steps:
1. Click "Register" and create a free account
2. In the registration form, describe your project as: "Hackathon project using AIS vessel tracking data to predict ghost fishing gear locations for marine conservation"
3. They approve API tokens within 24–48 hours (apply on Day 1!)
4. Once approved, go to your account dashboard and copy your API token
5. Share this token with your team via a private group chat (not in any public repo)

> **What this gives you:** Real vessel tracking data. You can query which fishing vessels went dark (turned off their AIS transponder) in a given ocean region, over any time period. A vessel that went dark while at sea is your primary ghost net signal.

### 1.4 Copernicus Marine Service (1 team member registers, shares credentials)
**Cost:** Completely free | **Credit card:** Not required
**URL:** https://data.marine.copernicus.eu/register

Steps:
1. Fill in the registration form — takes 2 minutes
2. No waiting period — access is instant after email verification
3. You can now download real ocean current data for any ocean region

> **What this gives you:** The EU's ocean current database, updated daily. This is what lets your agent calculate where a lost net has drifted since it was abandoned. Completely free, funded by the European Commission.

### 1.5 GitHub (all 4 team members)
**Cost:** Free
**URL:** https://github.com

Steps:
1. Each person creates or logs in to a GitHub account
2. One person creates a new **public** repository named: ghostwatch-agent
3. Add all teammates as collaborators (Settings → Collaborators)
4. This is where you'll submit your final code — judges look at the GitHub repo

### 1.6 GitHub Copilot (optional but strongly recommended)
**Cost:** Free for students
**URL:** https://github.com/features/copilot/plans

Steps:
1. Go to github.com/education/students and verify your student status
2. Once verified, Copilot is free on the Individual plan
3. Install the VS Code extension: search "GitHub Copilot" in the VS Code extensions panel

> **Why bother:** Copilot writes your boilerplate code for you. For beginners, this is the difference between spending 3 hours on a Python function vs 10 minutes. It won't write your whole project but it dramatically accelerates every small coding task.

### 1.7 Render (for deployment, if needed)
**Cost:** Free tier available
**URL:** https://render.com

Steps:
1. Sign up with your GitHub account
2. Free tier gives you one always-on web service — enough for a demo

> **Note:** The hackathon explicitly states that live deployment is NOT required for submission. You only need a working demo video and your GitHub repo. Only set up Render if you want a live URL for the demo — it's optional.

---

## Part 2 — The Architecture (Understanding What You're Building)

Before writing a single line of code, understand what the system does end-to-end.

```
[REPORTING FORM] → [FOUNDRY AGENT] → [DRIFT CALCULATOR] → [MISSION BRIEF]
      ↑                   ↑
[GFW AIS DATA]    [COPERNICUS CURRENTS]
```

In plain English:

1. **Someone reports a ghost net** — either via your web form, or the agent automatically checks GFW data for vessels that went dark in the ocean
2. **The agent receives the report** — location, date, vessel ID (if from AIS), or GPS coordinates (if from a human reporter)
3. **The agent calls the Drift Calculator** — this is a Python function that takes the starting location + date and uses Copernicus ocean current data to simulate where the net has drifted to today
4. **The agent scores the predicted location** — how close is it to endangered species zones? How close to a cleanup crew? How urgent?
5. **The agent generates a Mission Brief** — a clean PDF/text document with GPS coordinates, species at risk, recommended vessel type, urgency level
6. **The brief is displayed** on a simple dashboard and optionally sent as an email alert

That's the whole system. The cleverness is in steps 3 and 4 — that multi-step reasoning chain is exactly what the Reasoning Agents track judges.

---

## Part 3 — Team Role Split

Assign these roles on Day 1. Each person owns their vertical completely.

### Person A — The Agent Architect
**Owns:** Microsoft Foundry setup, agent reasoning loop, tool connections
**Skills needed:** Basic Python reading ability (Copilot writes most of it)
**Time estimate:** ~20 hours across the week

Tasks:
- Set up the Foundry project and invite teammates
- Create the agent with a system prompt (provided below)
- Connect the Drift Calculator as a custom tool
- Connect the GFW AIS query as a custom tool
- Connect the Mission Brief generator as a custom tool
- Test the full reasoning loop end-to-end

### Person B — The Data Engineer
**Owns:** GFW API integration, Copernicus API integration, Drift Calculator Python script
**Skills needed:** Basic Python (Copilot writes most of it), understanding of what an API is
**Time estimate:** ~22 hours across the week

Tasks:
- Register for GFW and Copernicus APIs
- Write the GFW query function (find vessels that went dark)
- Write the Copernicus current fetch function (get ocean current data for a region)
- Write the Drift Calculator (simple physics: location + current vector × time = new location)
- Package all three as a FastAPI endpoint that Foundry can call

### Person C — The Frontend Developer
**Owns:** The web interface — reporting form + mission brief dashboard
**Skills needed:** None (Claude and Copilot write the code; you direct and refine)
**Time estimate:** ~18 hours across the week

Tasks:
- Build the reporting form (where NGOs and fishers submit sightings)
- Build the mission brief dashboard (map + predicted location + urgency score)
- Deploy to Render (optional but good for demo)
- Make it look clean — this affects 15% of your score

### Person D — The Storyteller
**Owns:** Demo video, architecture diagram, GitHub repo documentation, Discord presence
**Skills needed:** Basic video editing (CapCut or DaVinci Resolve, both free)
**Time estimate:** ~15 hours across the week, front-loaded on Days 1–2 and back-loaded on Days 6–7

Tasks:
- Write the README.md for the GitHub repo (template provided below)
- Draw the architecture diagram (use Excalidraw — free, browser-based)
- Record and edit the 5-minute demo video
- Post daily progress updates in the Agents League Discord (builds community vote)
- Collect B-roll footage of ocean conservation for the video intro

---

## Part 4 — Day-by-Day Build Plan

**Today is June 7. Registration deadline is June 12. Submission deadline is June 14.**

### Day 1 (June 7, Saturday) — Setup Day
All 4 people:
- [ ] Create Azure for Students accounts
- [ ] Create GitHub accounts and set up the shared repo
- [ ] Register for GFW API (starts the 24–48 hour clock)
- [ ] Register for Copernicus (instant)
- [ ] Install VS Code + GitHub Copilot extension
- [ ] Join the Agents League Discord server

Person A: Log into ai.azure.com and create the Foundry project
Person D: Create the project README skeleton and post first Discord update

**End of Day 1 goal:** All accounts created, GFW application submitted, everyone has VS Code open

---

### Day 2 (June 8, Sunday) — Foundation Day
Person A:
- Read the Microsoft Foundry Quickstart (link: learn.microsoft.com/azure/ai-foundry/quickstart-agents)
- Create a simple test agent in Foundry that responds to a text prompt
- Goal: Have an agent that says "I am GhostWatch" when you ask "who are you?"

Person B:
- Install Python 3.11 from python.org (free)
- Install VS Code Python extension
- Write a test script that calls the Copernicus API and prints ocean current data for a sample location
- Use this starter code (paste into VS Code, let Copilot complete it):

```python
import copernicusmarine

# Log in with your Copernicus credentials
copernicusmarine.login()

# Fetch surface ocean current data for a sample region (Gulf of Mexico)
data = copernicusmarine.open_dataset(
    dataset_id="cmems_mod_glo_phy-cur_anfc_0.083deg_P1D-m",
    variables=["uo", "vo"],  # eastward and northward current components
    minimum_longitude=-97,
    maximum_longitude=-80,
    minimum_latitude=18,
    maximum_latitude=30,
    start_datetime="2026-06-01T00:00:00",
    end_datetime="2026-06-07T00:00:00",
)
print(data)
```

Person C:
- Go to v0.dev (free AI frontend builder by Vercel)
- Type: "Build a clean ocean conservation reporting form with fields for: location (lat/long), date observed, description, contact email, and a map pin selector"
- Download the generated code
- Open it in VS Code and run it locally

Person D:
- Download Excalidraw (excalidraw.com, browser-based, free)
- Draw the architecture diagram based on the diagram in Part 2
- Find 3–5 short video clips of ghost nets and ocean wildlife (use Pexels.com — free commercial use)

---

### Day 3 (June 9, Monday) — Core Logic Day
Person A:
- Write the Foundry agent system prompt (copy from Part 5 below)
- Define the 3 tools the agent will call: GFWQuery, DriftCalculator, MissionBriefGenerator
- Connect them as Function tools in Foundry (Foundry lets you register an HTTP endpoint as a tool — you'll connect to Person B's FastAPI URL)

Person B:
- Write the GFW query function: given a date range and ocean region, return vessels that had an AIS gap (went dark) for more than 12 hours
- GFW API endpoint to use: https://gateway.api.globalfishingwatch.org/v3/events?types=GAP
- Write the Drift Calculator function (see full code in Part 6)

Person C:
- Get the reporting form running locally
- Add a map component using Leaflet.js (free, open source)
- Make sure form submissions are stored (use a simple JSON file for now — no database needed for the demo)

Person D:
- Register the hackathon project on the submission platform (link comes in your registration email)
- Write the first draft of the project description for submission

---

### Day 4 (June 10, Tuesday) — Integration Day
All people: Connect your pieces

Person A + Person B:
- Person B deploys their FastAPI to Render (free)
- Person A adds the Render URL as a tool endpoint in Foundry
- Test: Ask the agent "check for ghost nets in the Bay of Bengal in the last 30 days" and see if it calls the GFW tool correctly

Person A + Person C:
- Person C adds a "Submit to Agent" button on the reporting form
- When clicked, it calls the Foundry agent API with the form data
- The agent runs the drift calculation and returns a mission brief
- Person C displays the mission brief on the results page

Person D:
- Start recording screen captures of every part of the build working
- Write the architecture section of the README

---

### Day 5 (June 11, Wednesday) — Polish Day
Focus on the 3 weak spots judges look for:

1. **Edge cases** — what happens if the GFW API returns no results? Make the agent say something intelligent, not crash
2. **Response quality** — is the mission brief clear and actionable? Read it out loud. Would a real cleanup crew understand it?
3. **UI quality** — does the dashboard look professional? Use Tailwind CSS classes or copy styles from shadcn.com

Person D: Post progress update in Discord with a screenshot of the working dashboard. Ask for feedback. Engage with comments.

---

### Day 6 (June 12, Thursday) — Demo Day
**Registration deadline is today at noon PT — confirm your registration is complete**

Record the 5-minute demo video. Structure it as:
- 0:00–0:40 — The problem (use your ocean footage clips here — emotional hook)
- 0:40–1:30 — The solution overview (show the architecture diagram)
- 1:30–3:30 — Live demo: submit a report, watch the agent reason, show the mission brief
- 3:30–4:15 — The IQ tools in action (screen share Foundry showing the tool calls happening)
- 4:15–5:00 — Impact and future vision ("if adopted globally, this could save...")

Upload to YouTube (unlisted is fine) or Vimeo.

---

### Day 7 (June 13, Friday) — Buffer + Final Submission Prep
- Fix any bugs found during demo recording
- Finalise GitHub repo (README, architecture diagram, requirements.txt, .env.example)
- Prepare submission form answers

---

### Day 8 (June 14, Saturday) — Submit
**Submission deadline: 11:59 PM Pacific Time**

Submit on the hackathon platform with:
- [ ] GitHub repository URL
- [ ] YouTube/Vimeo demo video URL
- [ ] Architecture diagram (can be in the repo)
- [ ] Project description
- [ ] Track selection: Reasoning Agents
- [ ] Special category nominations: Hack for Good, Best use of IQ tools

---

## Part 5 — The Foundry Agent System Prompt

Copy this exactly into your Foundry agent configuration:

```
You are GhostWatch, an AI agent dedicated to tracking and eliminating ghost fishing gear from the world's oceans.

Ghost fishing gear — abandoned nets, lines, and traps — kills over 300,000 marine animals every year and makes up 46% of the Great Pacific Garbage Patch. You exist to find it before more animals die.

You have access to three tools:
1. GFWQuery — queries Global Fishing Watch for fishing vessels that have gone dark (turned off AIS transponders) in a specified ocean region and time period. A vessel going dark at sea is the primary signal of potential ghost gear.
2. DriftCalculator — given a starting GPS location and date, calculates where gear has likely drifted to today using real-time ocean current data from Copernicus Marine Service.
3. MissionBriefGenerator — takes a predicted gear location and generates a clean, actionable mission brief for cleanup crews, including GPS coordinates, species at risk in that zone, estimated gear age, and recommended vessel type.

When you receive a ghost net report or a query to check an ocean region, you must:
STEP 1: Query GFW for vessels that went dark in that region during the specified time period.
STEP 2: For each dark vessel event, call DriftCalculator with the vessel's last known location and the date it went dark.
STEP 3: Score each predicted location by urgency (proximity to marine protected areas or endangered species corridors adds urgency; proximity to ports and cleanup infrastructure adds feasibility).
STEP 4: Call MissionBriefGenerator for the top 3 highest-priority locations.
STEP 5: Return the mission briefs to the user with a clear summary of urgency and recommended action.

Always be specific with coordinates. Always explain your reasoning between steps. Always note the confidence level of each drift prediction (higher confidence for shorter drift periods; lower confidence for gear that has been adrift for months).

You care deeply about every animal in danger. A whale drowning in a ghost net right now is your priority.
```

---

## Part 6 — The Drift Calculator (Full Code)

Person B: save this as `drift_calculator.py`. Let Copilot help you fill in any gaps.

```python
import copernicusmarine
import numpy as np
from datetime import datetime, timedelta
from typing import Tuple

def calculate_drift(
    start_lat: float,
    start_lon: float,
    start_date: str,  # format: "2026-05-01"
    days_adrift: int
) -> dict:
    """
    Calculate where a ghost net has drifted given:
    - Starting position (lat, lon)
    - Date it was lost
    - Number of days it has been adrift
    
    Returns a dict with predicted current location and confidence score.
    """
    
    # Fetch ocean current data for the region and time period
    # uo = eastward current (m/s), vo = northward current (m/s)
    try:
        data = copernicusmarine.open_dataset(
            dataset_id="cmems_mod_glo_phy-cur_anfc_0.083deg_P1D-m",
            variables=["uo", "vo"],
            minimum_longitude=start_lon - 10,
            maximum_longitude=start_lon + 10,
            minimum_latitude=start_lat - 10,
            maximum_latitude=start_lat + 10,
            start_datetime=start_date + "T00:00:00",
            end_datetime=(
                datetime.strptime(start_date, "%Y-%m-%d") + 
                timedelta(days=days_adrift)
            ).strftime("%Y-%m-%dT00:00:00"),
            minimum_depth=0,
            maximum_depth=1  # surface currents only
        )
    except Exception as e:
        return {"error": f"Could not fetch ocean current data: {str(e)}"}
    
    # Simple Euler integration: new position = old position + (current × time step)
    # 1 degree latitude ≈ 111 km, 1 degree longitude ≈ 111 km × cos(lat)
    
    current_lat = start_lat
    current_lon = start_lon
    
    for day in range(days_adrift):
        try:
            # Get current velocity at current position for this day
            day_data = data.isel(time=min(day, len(data.time)-1))
            
            # Find nearest grid point to current position
            lat_idx = abs(data.latitude.values - current_lat).argmin()
            lon_idx = abs(data.longitude.values - current_lon).argmin()
            
            # Get current components in m/s
            u_current = float(day_data.uo.values[lat_idx, lon_idx])  # eastward
            v_current = float(day_data.vo.values[lat_idx, lon_idx])  # northward
            
            # Handle NaN values (land or missing data)
            if np.isnan(u_current) or np.isnan(v_current):
                u_current = 0
                v_current = 0
            
            # Convert m/s to degrees per day
            # 1 degree lat = 111,000 m; 1 degree lon = 111,000 * cos(lat) m
            seconds_per_day = 86400
            delta_lat = (v_current * seconds_per_day) / 111000
            delta_lon = (u_current * seconds_per_day) / (111000 * np.cos(np.radians(current_lat)))
            
            current_lat += delta_lat
            current_lon += delta_lon
            
        except Exception:
            # If any day's calculation fails, continue with last known position
            continue
    
    # Confidence degrades with time: high confidence < 7 days, medium 7-30, low > 30
    if days_adrift < 7:
        confidence = "HIGH"
        confidence_radius_km = days_adrift * 15  # ~15km uncertainty per day
    elif days_adrift < 30:
        confidence = "MEDIUM"
        confidence_radius_km = days_adrift * 25
    else:
        confidence = "LOW"
        confidence_radius_km = days_adrift * 40
    
    return {
        "predicted_lat": round(current_lat, 4),
        "predicted_lon": round(current_lon, 4),
        "confidence": confidence,
        "confidence_radius_km": confidence_radius_km,
        "days_adrift": days_adrift,
        "start_location": {"lat": start_lat, "lon": start_lon},
        "drift_distance_km": round(
            np.sqrt(
                ((current_lat - start_lat) * 111) ** 2 + 
                ((current_lon - start_lon) * 111 * np.cos(np.radians(start_lat))) ** 2
            ), 1
        )
    }
```

---

## Part 7 — The GFW Query Function

```python
import requests
from datetime import datetime, timedelta

GFW_API_TOKEN = "YOUR_GFW_TOKEN_HERE"  # Store in .env file, never in repo

def query_ais_gaps(
    min_lat: float,
    max_lat: float, 
    min_lon: float,
    max_lon: float,
    start_date: str,  # "2026-05-01"
    end_date: str,    # "2026-06-07"
    min_gap_hours: int = 12  # only return gaps > 12 hours
) -> list:
    """
    Query Global Fishing Watch for fishing vessels that went dark
    (AIS gaps) in a given ocean region and time period.
    
    A vessel going dark at sea = potential ghost gear signal.
    """
    
    headers = {
        "Authorization": f"Bearer {GFW_API_TOKEN}",
        "Content-Type": "application/json"
    }
    
    params = {
        "datasets[0]": "public-global-gaps:latest",
        "start-date": start_date,
        "end-date": end_date,
        "bbox": f"{min_lon},{min_lat},{max_lon},{max_lat}",
        "types[0]": "GAP",
        "filters[0]": f"gap_duration_hours > {min_gap_hours}",
        "limit": 50,
        "sort": "-gap_duration_hours"  # longest gaps first
    }
    
    try:
        response = requests.get(
            "https://gateway.api.globalfishingwatch.org/v3/events",
            headers=headers,
            params=params
        )
        response.raise_for_status()
        data = response.json()
        
        # Extract the key fields we need
        gaps = []
        for event in data.get("entries", []):
            gaps.append({
                "vessel_id": event.get("vessel", {}).get("id", "unknown"),
                "vessel_name": event.get("vessel", {}).get("name", "unknown"),
                "vessel_flag": event.get("vessel", {}).get("flag", "unknown"),
                "gap_start_lat": event.get("position", {}).get("lat"),
                "gap_start_lon": event.get("position", {}).get("lon"),
                "gap_start_date": event.get("start"),
                "gap_duration_hours": event.get("gap_duration_hours", 0),
                "vessel_type": event.get("vessel", {}).get("vesselType", "fishing")
            })
        
        # Filter to only fishing vessels (exclude cargo, tankers, etc.)
        fishing_gaps = [g for g in gaps if "fishing" in g.get("vessel_type", "").lower()]
        
        return fishing_gaps
        
    except requests.exceptions.RequestException as e:
        return [{"error": f"GFW API error: {str(e)}"}]
```

---

## Part 8 — FastAPI Wrapper (Connecting to Foundry)

Person B: This is what makes your Python functions callable by the Foundry agent.

```python
from fastapi import FastAPI
from pydantic import BaseModel
from drift_calculator import calculate_drift
from gfw_query import query_ais_gaps

app = FastAPI(title="GhostWatch Tools API")

class DriftRequest(BaseModel):
    start_lat: float
    start_lon: float
    start_date: str
    days_adrift: int

class GFWRequest(BaseModel):
    min_lat: float
    max_lat: float
    min_lon: float
    max_lon: float
    start_date: str
    end_date: str

@app.get("/health")
def health():
    return {"status": "GhostWatch Tools API is running"}

@app.post("/drift")
def drift_endpoint(req: DriftRequest):
    return calculate_drift(
        req.start_lat, req.start_lon, 
        req.start_date, req.days_adrift
    )

@app.post("/ais-gaps")
def ais_gaps_endpoint(req: GFWRequest):
    return query_ais_gaps(
        req.min_lat, req.max_lat,
        req.min_lon, req.max_lon,
        req.start_date, req.end_date
    )

# To run locally: uvicorn main:app --reload
# Visit http://localhost:8000/docs to test via auto-generated UI
```

To run this: `pip install fastapi uvicorn copernicusmarine requests` then `uvicorn main:app --reload`

---

## Part 9 — Frontend (Person C's Complete Guide)

**Recommended approach: Use Lovable.dev or v0.dev — both are free AI frontend builders.**

Go to lovable.dev or v0.dev and paste this prompt:

> "Build a dark-themed ocean conservation web app called GhostWatch. It needs two pages:
> 
> PAGE 1 — Report Form: A form with fields for 'Location (lat/long)', 'Date Observed', 'Description', 'Your Email', and an interactive Leaflet.js map where users can click to set their GPS location. Submit button sends data to a backend API.
>
> PAGE 2 — Mission Brief Dashboard: Shows a full-screen Leaflet.js map with markers for predicted ghost net locations. Each marker shows a popup with: urgency level (HIGH/MEDIUM/LOW with color coding), predicted coordinates, species at risk, days adrift, and confidence level. Include a sidebar showing the 3 most urgent mission briefs as cards.
>
> Color scheme: deep navy (#0B1829), ocean teal (#1A9E8F), alert orange (#FF6B35). Font: clean, readable sans-serif. Make it look like a real marine conservation tool."

Download the generated code. Person A will connect it to the Foundry agent endpoint.

---

## Part 10 — What the IQ Tools Integration Looks Like

This is what makes you competitive for the "Best use of IQ tools" secondary prize.

In your Foundry project, navigate to **Knowledge** → **Add data source** and add:

**Web IQ sources (Web IQ):**
- IUCN Red List species range maps API: iucnredlist.org/api (free registration)
- Ocean Biodiversity Information System (OBIS): api.obis.org (completely free, no registration)
- Marine Protected Areas database: mpatlas.org (free download)

**Foundry IQ (document knowledge):**
- Upload these free PDFs to your Foundry knowledge base:
  - "Ghost Gear: The most deadly form of marine plastic" (WWF report, free download)
  - NOAA's "Derelict Fishing Gear" fact sheets (free from fisheries.noaa.gov)
  - IMO's ghost gear guidelines (free from imo.org)

When the agent generates a mission brief, it can now answer: "Are there leatherback turtles in this predicted location?" by querying the OBIS API via Web IQ. This is genuine IQ tools integration, not a checkbox.

In your demo video, show the Foundry tool calls panel — the moment it calls Web IQ and returns "yes, leatherback sea turtles migrate through this corridor in June" is the moment judges lean forward.

---

## Part 11 — GitHub README Template

Person D: Copy and fill this in.

```markdown
# GhostWatch 🌊
### AI-powered ghost fishing gear detection and cleanup coordination

> 300,000 marine animals die every year in ghost fishing nets. GhostWatch finds them before they do.

## What it does
GhostWatch is a multi-step reasoning agent that:
1. Monitors Global Fishing Watch AIS data for fishing vessels that went dark at sea
2. Calculates where the abandoned gear has drifted using real-time Copernicus ocean current data
3. Scores predicted locations by urgency (species at risk, proximity to cleanup resources)
4. Generates actionable mission briefs for NGO cleanup crews

## Architecture
![Architecture Diagram](./architecture.png)

## Tech Stack
- **Agent framework:** Microsoft Azure AI Foundry
- **IQ Tools:** Foundry IQ (marine biodiversity data), Web IQ (OBIS, MPA Atlas)
- **Vessel data:** Global Fishing Watch AIS API (free, open data)
- **Ocean currents:** Copernicus Marine Service API (free, EU-funded)
- **Frontend:** React + Leaflet.js
- **Backend:** FastAPI (Python)
- **Deployment:** Render (free tier)

## Tracks & Awards Targeted
- ✅ Reasoning Agents (primary)
- ✅ Hack for Good
- ✅ Best use of IQ tools

## Team
- [Name 1] — Agent architecture & Foundry
- [Name 2] — Data engineering (GFW + Copernicus)
- [Name 3] — Frontend & UX
- [Name 4] — Research, documentation, demo

## Setup
See [SETUP.md](./SETUP.md) for complete local setup instructions.

## Demo
[Watch the demo](YOUR_YOUTUBE_LINK_HERE)
```

---

## Part 12 — Demo Video Script

**Length: 4–5 minutes exactly**

**0:00–0:45 — The Hook (use your ocean footage here)**
Narrate over footage of ocean wildlife:
> "Every year, 640,000 tonnes of fishing gear is abandoned in the world's oceans. These ghost nets keep killing — for decades — trapping whales, sea turtles, dolphins, and sharks. Over 300,000 marine animals die this way every year. The reason this keeps happening is not lack of concern. It's lack of intelligence. Nobody knows where the nets are."

**0:45–1:30 — The Insight**
Show your architecture diagram:
> "GhostWatch changes that. We built a reasoning agent that connects three data sources that have never been combined before: Global Fishing Watch's vessel tracking data, Copernicus Marine's real-time ocean current models, and IUCN's marine biodiversity intelligence. The agent finds vessels that went dark at sea, calculates where their gear has drifted, and tells cleanup crews exactly where to go."

**1:30–3:00 — The Live Demo**
Screen recording of the agent working:
> "Let's say a conservation NGO wants to check the Bay of Bengal. [Type the query into the form]. The agent calls GFW — [show the tool call in Foundry] — and finds three vessels that had AIS gaps over 24 hours last month. For each vessel, it calls the Drift Calculator with Copernicus current data — [show the tool call] — and predicts where the gear is today. It then checks OBIS for species in those locations — [show Web IQ call] — and discovers that all three predicted zones are within the Olive Ridley sea turtle migration corridor. High urgency. [Show the mission brief appearing]."

**3:00–4:00 — The Mission Brief**
Show the final output:
> "Here's what a cleanup crew receives. GPS coordinates, confidence radius, species at risk, estimated gear age, recommended vessel type. Actionable intelligence, not a research report."

**4:00–4:45 — The Impact**
> "We built this in 7 days as students. But the data is real. The currents are real. The turtle migration corridors are real. If this were deployed globally, every NGO with a boat would know where to go. We're not just predicting ghost nets. We're giving marine conservation its first intelligence layer."

---

## Part 13 — Costs Summary

| Resource | Cost | Notes |
|---|---|---|
| Azure for Students | Free ($100 credit) | No credit card required |
| Microsoft Foundry (agent calls) | ~$2–5 total | Covered by $100 credit |
| Global Fishing Watch API | Free | Educational/conservation use |
| Copernicus Marine Service | Free | EU-funded public service |
| GitHub | Free | |
| GitHub Copilot | Free (student) | Verify via github.com/education |
| Render deployment | Free | Free tier, no credit card |
| Lovable.dev / v0.dev | Free tier | Limited generations, enough for demo |
| Excalidraw (architecture diagram) | Free | Browser-based |
| CapCut (demo video editing) | Free | |
| Total | $0 | |

---

## Part 14 — If Things Go Wrong

**"GFW API token hasn't arrived yet"**
Use their sample data from the GitHub repo: github.com/GlobalFishingWatch/api-samples — they have static JSON files with real gap events you can use for the demo.

**"Copernicus data is too slow to download"**
Pre-download a week of current data for one ocean region (Gulf of Mexico or Bay of Bengal) and cache it as a local file. The agent calls your local cache instead of the live API. Perfectly fine for a demo.

**"Foundry agent isn't calling my tools correctly"**
Add a fallback: if the tool call fails, the agent should return a simulated result with a clear note that it's simulated. Judges understand demos aren't production systems.

**"We ran out of time and the frontend isn't done"**
The GitHub repo and demo video are what's judged, not a live URL. Record a Jupyter notebook showing the agent running in the terminal. It's less polished but perfectly submittable.

**"Azure credits are running low"**
Turn off your Foundry deployment when you're not actively testing. The model only costs credits when it's making API calls — idle deployments don't cost anything.

---

*GhostWatch — Built for the Microsoft Agents League Hackathon 2026*
*"Find it before another animal dies in it."*
```
