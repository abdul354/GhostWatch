from __future__ import annotations

from datetime import UTC, datetime, timedelta
from random import Random
from typing import Any


_MOCK_VESSELS = [
    {
        "mmsi": "636092018",
        "imo": "9876543",
        "vessel_name": "Sea Lantern",
        "flag": "PAN",
        "vessel_type": "Cargo",
        "last_known_position": {"latitude": 14.3821, "longitude": -87.2144},
        "gap_hours": 18.4,
        "risk_score": 0.91,
        "reason": "AIS silence inside protected corridor",
    },
    {
        "mmsi": "412345678",
        "imo": "9011223",
        "vessel_name": "Blue Horizon",
        "flag": "LBR",
        "vessel_type": "Fishing",
        "last_known_position": {"latitude": 9.8142, "longitude": -83.6911},
        "gap_hours": 9.7,
        "risk_score": 0.76,
        "reason": "Repeated dark gap near known transshipment route",
    },
    {
        "mmsi": "319876543",
        "imo": "9321456",
        "vessel_name": "North Star",
        "flag": "VUT",
        "vessel_type": "Tanker",
        "last_known_position": {"latitude": 10.4028, "longitude": -84.3017},
        "gap_hours": 5.1,
        "risk_score": 0.63,
        "reason": "Short AIS outage while moving through sensitive waters",
    },
]


def mock_gfw_query(
    *,
    min_lat: float,
    max_lat: float,
    min_lon: float,
    max_lon: float,
    start_date: str,
    end_date: str,
    limit: int = 5,
) -> list[dict[str, Any]]:
    """Return realistic dummy Global Fishing Watch data for frontend development."""

    seed = f"{min_lat}:{max_lat}:{min_lon}:{max_lon}:{start_date}:{end_date}:{limit}"
    rng = Random(seed)
    now = datetime.now(UTC)

    vessels: list[dict[str, Any]] = []
    span_lat = max(0.01, max_lat - min_lat)
    span_lon = max(0.01, max_lon - min_lon)

    for vessel in _MOCK_VESSELS[: max(1, limit)]:
        offset_minutes = rng.randint(10, 240)
        adjusted_gap = round(vessel["gap_hours"] + rng.uniform(-0.8, 0.8), 1)
        gap_start_lat = round(min_lat + rng.random() * span_lat, 4)
        gap_start_lon = round(min_lon + rng.random() * span_lon, 4)
        vessel_id = vessel["mmsi"]
        vessels.append(
            {
                "vessel_id": vessel_id,
                "vessel_name": vessel["vessel_name"],
                "vessel_flag": vessel["flag"],
                "gap_start_lat": gap_start_lat,
                "gap_start_lon": gap_start_lon,
                "gap_start_date": start_date,
                "gap_duration_hours": max(1.0, adjusted_gap),
                "vessel_type": vessel["vessel_type"],
                "last_seen": (now - timedelta(minutes=offset_minutes)).isoformat(),
                "distance_km_from_query": round(rng.uniform(8.0, 140.0), 1),
                "risk_score": vessel["risk_score"],
                "reason": vessel["reason"],
                "gap_hours": max(1.0, adjusted_gap),
                "priority_rank": len(vessels) + 1,
            }
        )

    return vessels


def get_ais_gaps(
    *,
    min_lat: float,
    max_lat: float,
    min_lon: float,
    max_lon: float,
    start_date: str,
    end_date: str,
    limit: int = 5,
    use_mock: bool = True,
) -> list[dict[str, Any]]:
    """Return AIS gap data.

    The mock path is enabled by default so frontend development can continue
    without waiting for Global Fishing Watch credentials.
    """

    if use_mock:
        return mock_gfw_query(
            min_lat=min_lat,
            max_lat=max_lat,
            min_lon=min_lon,
            max_lon=max_lon,
            start_date=start_date,
            end_date=end_date,
            limit=limit,
        )

    raise RuntimeError(
        "Live Global Fishing Watch access is not configured yet. Set use_mock=True "
        "or implement the authenticated API request path before switching this off."
    )