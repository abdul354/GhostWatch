from __future__ import annotations

from math import cos
from typing import Any

import numpy as np


EARTH_RADIUS_METERS = 6_371_000.0
METERS_PER_DEGREE_LAT = 111_320.0


def _validate_coordinate(latitude: float, longitude: float) -> None:
    if not -90.0 <= latitude <= 90.0:
        raise ValueError("latitude must be between -90 and 90")
    if not -180.0 <= longitude <= 180.0:
        raise ValueError("longitude must be between -180 and 180")


def calculate_drift_path(
    *,
    start_latitude: float,
    start_longitude: float,
    current_u_m_s: float,
    current_v_m_s: float,
    hours: float,
    step_hours: float = 1.0,
) -> dict[str, Any]:
    """Project an ocean drift path using a simple current-based approximation.

    The computation is vectorized with NumPy to keep the path generation fast
    enough for repeated API calls and to avoid Python loops on longer windows.
    """

    _validate_coordinate(start_latitude, start_longitude)
    if hours <= 0:
        raise ValueError("hours must be greater than 0")
    if step_hours <= 0:
        raise ValueError("step_hours must be greater than 0")

    total_seconds = hours * 3600.0
    step_seconds = step_hours * 3600.0
    step_count = max(1, int(np.ceil(total_seconds / step_seconds)))

    times = np.linspace(0.0, total_seconds, step_count + 1)
    delta_lat = (current_v_m_s * times) / METERS_PER_DEGREE_LAT

    lat_radians = np.deg2rad(start_latitude)
    meters_per_degree_lon = METERS_PER_DEGREE_LAT * max(0.01, cos(lat_radians))
    delta_lon = (current_u_m_s * times) / meters_per_degree_lon

    latitudes = start_latitude + delta_lat
    longitudes = start_longitude + delta_lon

    path = [
        {
            "hour": round(seconds / 3600.0, 3),
            "latitude": round(float(lat), 6),
            "longitude": round(float(lon), 6),
        }
        for seconds, lat, lon in zip(times, latitudes, longitudes, strict=True)
    ]

    end_latitude = float(latitudes[-1])
    end_longitude = float(longitudes[-1])

    displacement_meters = float(
        np.hypot(
            (end_latitude - start_latitude) * METERS_PER_DEGREE_LAT,
            (end_longitude - start_longitude) * meters_per_degree_lon,
        )
    )

    return {
        "start": {
            "latitude": round(start_latitude, 6),
            "longitude": round(start_longitude, 6),
        },
        "end": {
            "latitude": round(end_latitude, 6),
            "longitude": round(end_longitude, 6),
        },
        "current": {
            "u_m_s": current_u_m_s,
            "v_m_s": current_v_m_s,
        },
        "window_hours": hours,
        "step_hours": step_hours,
        "displacement_km": round(displacement_meters / 1000.0, 3),
        "path": path,
    }
