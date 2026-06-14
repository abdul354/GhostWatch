from __future__ import annotations

from datetime import date
from typing import Any, Literal

from drift_calculator import calculate_drift_path_with_copernicus
from foundry_agent import generate_foundry_plan
from gfw_query import get_ais_gaps


Priority = Literal["critical", "high", "medium", "low"]


def _priority_from_score(score: float) -> Priority:
    if score >= 0.82:
        return "critical"
    if score >= 0.66:
        return "high"
    if score >= 0.45:
        return "medium"
    return "low"


def _normalize_gap_hours(record: dict[str, Any]) -> float:
    raw = record.get("gap_duration_hours", record.get("gap_hours", 0.0))
    return max(0.0, float(raw))


def _risk_score(record: dict[str, Any], displacement_km: float) -> float:
    base_risk = float(record.get("risk_score", 0.5))
    gap_hours = _normalize_gap_hours(record)
    vessel_type = str(record.get("vessel_type", "")).lower()

    gap_pressure = min(gap_hours / 24.0, 1.0) * 0.22
    drift_pressure = min(displacement_km / 25.0, 1.0) * 0.14
    fishing_pressure = 0.09 if "fishing" in vessel_type else 0.0

    return round(min(0.99, base_risk + gap_pressure + drift_pressure + fishing_pressure), 3)


def build_reasoning_brief(
    *,
    min_lat: float,
    max_lat: float,
    min_lon: float,
    max_lon: float,
    start_date: date,
    end_date: date,
    limit: int = 3,
    use_mock: bool = True,
    use_foundry: bool = True,
) -> dict[str, Any]:
    """Build a deterministic mission brief from AIS gaps and drift projection.

    This intentionally works without LLM/API credentials so the hackathon demo
    can run anywhere. A hosted model can later summarize this same structured
    brief without changing the frontend contract.
    """

    gaps = get_ais_gaps(
        min_lat=min_lat,
        max_lat=max_lat,
        min_lon=min_lon,
        max_lon=max_lon,
        start_date=start_date,
        end_date=end_date,
        limit=limit,
        use_mock=use_mock,
    )

    incidents: list[dict[str, Any]] = []
    for rank, gap in enumerate(gaps, start=1):
        latitude = float(gap["gap_start_lat"])
        longitude = float(gap["gap_start_lon"])
        gap_hours = _normalize_gap_hours(gap)
        drift = calculate_drift_path_with_copernicus(
            start_latitude=latitude,
            start_longitude=longitude,
            when=start_date,
            hours=min(max(gap_hours, 6.0), 48.0),
            step_hours=6.0,
            fallback_to_mock=True,
        )
        score = _risk_score(gap, float(drift["displacement_km"]))
        priority = _priority_from_score(score)
        vessel_name = str(gap.get("vessel_name", "Unknown vessel"))
        vessel_type = str(gap.get("vessel_type", "unknown"))

        incidents.append(
            {
                "rank": rank,
                "priority": priority,
                "risk_score": score,
                "target": {
                    "vessel_id": gap.get("vessel_id"),
                    "vessel_name": vessel_name,
                    "vessel_flag": gap.get("vessel_flag"),
                    "vessel_type": vessel_type,
                },
                "location": {
                    "latitude": latitude,
                    "longitude": longitude,
                },
                "signals": [
                    f"AIS silence lasted {round(gap_hours, 1)} hours",
                    f"Projected drift displacement is {drift['displacement_km']} km",
                    str(gap.get("reason", "AIS anomaly requires review")),
                ],
                "drift": {
                    "end": drift["end"],
                    "displacement_km": drift["displacement_km"],
                    "current": drift["current"],
                },
                "recommended_action": _recommended_action(priority, vessel_type),
            }
        )

    incidents.sort(key=lambda item: item["risk_score"], reverse=True)
    for index, incident in enumerate(incidents, start=1):
        incident["rank"] = index

    top = incidents[0] if incidents else None
    summary = (
        f"{top['target']['vessel_name']} is the top intervention target with "
        f"{top['priority']} priority and a {top['risk_score']} risk score."
        if top
        else "No AIS gaps were found for this operating window."
    )

    brief = {
        "agent": "GhostWatch Reasoning Agent",
        "mode": "foundry-ready deterministic fallback",
        "summary": summary,
        "operating_window": {
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat(),
            "bounds": {
                "min_lat": min_lat,
                "max_lat": max_lat,
                "min_lon": min_lon,
                "max_lon": max_lon,
            },
        },
        "incidents": incidents,
        "api_notes": [
            "AIS gaps use mock mode unless Global Fishing Watch credentials are wired.",
            "Drift uses Copernicus credentials when present, otherwise seeded currents.",
            "The structured brief can be passed to Azure AI Foundry for natural-language planning.",
        ],
    }

    if use_foundry:
        brief["foundry"] = generate_foundry_plan(brief)
    else:
        brief["foundry"] = {
            "status": {
                "provider": "Azure AI Foundry",
                "state": "disabled",
                "configured": False,
                "deployment": "not requested",
                "details": "Foundry handoff was disabled for this request.",
            },
            "source": "local deterministic fallback",
            "plan": "Foundry handoff disabled. Local ranking is still available.",
        }

    return brief


def _recommended_action(priority: Priority, vessel_type: str) -> str:
    if priority == "critical":
        return "Dispatch recovery crew and request vessel identity review."
    if priority == "high":
        return "Queue patrol sweep and monitor next AIS reappearance."
    if "fishing" in vessel_type.lower():
        return "Monitor for repeated dark activity near sensitive habitat."
    return "Keep in watchlist and refresh with next satellite pass."
