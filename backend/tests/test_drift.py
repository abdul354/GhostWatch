import datetime

from drift_calculator import calculate_drift_path_with_copernicus
from reasoning_agent import build_reasoning_brief


def test_seeded_drift_demo():
    """Validate the deterministic seeded mock drift used by `/drift-demo`.

    The values asserted here mirror the smoke-test output used by the demo
    route and are intentionally tolerant to floating-point rounding.
    """
    res = calculate_drift_path_with_copernicus(
        start_latitude=15.0,
        start_longitude=85.0,
        when=datetime.date(2026, 6, 1),
        hours=24.0,
        step_hours=6.0,
        fallback_to_mock=True,
    )

    end = res["end"]
    assert abs(end["latitude"] - 14.898326) < 1e-5
    assert abs(end["longitude"] - 85.005625) < 1e-5


def test_reasoning_brief_ranks_incidents():
    brief = build_reasoning_brief(
        min_lat=10.0,
        max_lat=20.0,
        min_lon=80.0,
        max_lon=90.0,
        start_date=datetime.date(2026, 5, 1),
        end_date=datetime.date(2026, 6, 7),
        limit=3,
        use_mock=True,
    )

    assert brief["agent"] == "GhostWatch Reasoning Agent"
    assert brief["mode"] == "deterministic"
    assert len(brief["incidents"]) == 3
    assert brief["incidents"][0]["risk_score"] >= brief["incidents"][1]["risk_score"]
    assert brief["incidents"][0]["recommended_action"]
