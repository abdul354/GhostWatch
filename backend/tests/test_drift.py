import datetime

from drift_calculator import calculate_drift_path_with_copernicus


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
