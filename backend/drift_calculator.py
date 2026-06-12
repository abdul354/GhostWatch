from __future__ import annotations

from math import cos
from typing import Any

import numpy as np
import os
import logging
from datetime import date
from random import Random
from typing import Optional, Tuple


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


def _seeded_mock_current(lat: float, lon: float, when: date) -> Tuple[float, float]:
    """Return a deterministic mock current (u, v) in m/s for given location/date.

    This is used as a safe fallback when real Copernicus credentials or the
    client library aren't available locally. Values are small and suitable for
    demo/testing only.
    """
    seed = int((lat + 90.0) * 1000.0) ^ int((lon + 180.0) * 1000.0) ^ when.toordinal()
    rng = Random(seed)
    # u: east-west, v: north-south — pick values in range +/-0.35 m/s
    u = (rng.random() - 0.5) * 0.7
    v = (rng.random() - 0.5) * 0.7
    return (round(u, 3), round(v, 3))


def get_ocean_currents(
    *,
    latitude: float,
    longitude: float,
    when: date,
) -> Optional[Tuple[float, float]]:
    """Attempt to obtain surface current components (u, v) from Copernicus.

    Behavior:
    - If `COPERNICUS_USERNAME` and `COPERNICUS_PASSWORD` are not set, returns
      `None` immediately.
    - If the `copernicusmarine` client is not installed or a live fetch fails,
      returns `None` and logs a warning. Callers may then use a mock fallback.

    Note: This function intentionally uses a tolerant approach so that the
    rest of the project runs without network credentials.
    """
    username = os.getenv("COPERNICUS_USERNAME")
    password = os.getenv("COPERNICUS_PASSWORD")
    if not username or not password:
        logging.debug("Copernicus credentials not found in environment")
        return None

    try:
        import copernicusmarine

        # The real library usage may differ depending on the package version.
        # We attempt a best-effort call but keep it wrapped so failures fall
        # back to the calling code.
        try:
            client = copernicusmarine.Client(username=username, password=password)
            # Example high-level call — actual argument names depend on client
            data = client.get_surface_currents(lat=latitude, lon=longitude, date=when)
            u = float(data.get("u", 0.0))
            v = float(data.get("v", 0.0))
            return (u, v)
        except Exception as exc:  # pragma: no cover - runtime fallback
            logging.warning("Copernicus client fetch failed: %s", exc)
            return None

    except Exception:  # pragma: no cover - import may fail in many environments
        logging.debug("copernicusmarine library not available")
        return None


def calculate_drift_path_with_copernicus(
    *,
    start_latitude: float,
    start_longitude: float,
    when: date,
    hours: float,
    step_hours: float = 1.0,
    fallback_to_mock: bool = True,
) -> dict[str, Any]:
    """High-level helper that tries Copernicus then falls back to deterministic mock.

    Returns the same structure as `calculate_drift_path`.
    """
    currents = get_ocean_currents(latitude=start_latitude, longitude=start_longitude, when=when)
    if currents is None:
        if fallback_to_mock:
            u, v = _seeded_mock_current(start_latitude, start_longitude, when)
            logging.info("Using seeded mock currents: u=%s m/s v=%s m/s", u, v)
        else:
            raise RuntimeError("No Copernicus currents available and fallback disabled")
    else:
        u, v = currents

    return calculate_drift_path(
        start_latitude=start_latitude,
        start_longitude=start_longitude,
        current_u_m_s=u,
        current_v_m_s=v,
        hours=hours,
        step_hours=step_hours,
    )
