from __future__ import annotations

from datetime import date
from typing import Any, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, model_validator
from dotenv import load_dotenv

from drift_calculator import calculate_drift_path, calculate_drift_path_with_copernicus
from gfw_query import get_ais_gaps
from reasoning_agent import build_reasoning_brief

load_dotenv()


class DriftRequest(BaseModel):
    start_latitude: float = Field(..., ge=-90.0, le=90.0)
    start_longitude: float = Field(..., ge=-180.0, le=180.0)
    # If provided, these explicit current components will be used instead of
    # querying Copernicus (or falling back to the seeded mock).
    current_u_m_s: Optional[float] = Field(None, description="East-west current component in m/s")
    current_v_m_s: Optional[float] = Field(None, description="North-south current component in m/s")
    # Date for which to query Copernicus surface currents. Defaults to today.
    start_date: date = Field(default_factory=date.today)
    hours: float = Field(..., gt=0)
    step_hours: float = Field(1.0, gt=0)
    # When Copernicus is unavailable, fall back to deterministic mock currents.
    fallback_to_mock: bool = True


class AISGapRequest(BaseModel):
    min_lat: float = Field(..., ge=-90.0, le=90.0)
    max_lat: float = Field(..., ge=-90.0, le=90.0)
    min_lon: float = Field(..., ge=-180.0, le=180.0)
    max_lon: float = Field(..., ge=-180.0, le=180.0)
    start_date: date
    end_date: date
    limit: int = Field(5, ge=1, le=50)
    use_mock: bool = True

    @model_validator(mode="after")
    def validate_logic(self) -> "AISGapRequest":
        if self.min_lat >= self.max_lat:
            raise ValueError("min_lat must be strictly less than max_lat")
        if self.min_lon >= self.max_lon:
            raise ValueError("min_lon must be strictly less than max_lon")
        if self.start_date >= self.end_date:
            raise ValueError("start_date must be before end_date")
        return self


class ReasoningBriefRequest(AISGapRequest):
    limit: int = Field(3, ge=1, le=10)
    use_foundry: bool = True


app = FastAPI(title="GhostWatch Tools API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/drift")
def drift_endpoint(payload: DriftRequest) -> dict[str, Any]:
    try:
        # If explicit current components were supplied, use them.
        if payload.current_u_m_s is not None and payload.current_v_m_s is not None:
            return calculate_drift_path(
                start_latitude=payload.start_latitude,
                start_longitude=payload.start_longitude,
                current_u_m_s=payload.current_u_m_s,
                current_v_m_s=payload.current_v_m_s,
                hours=payload.hours,
                step_hours=payload.step_hours,
            )

        # Otherwise, attempt Copernicus (with deterministic fallback).
        return calculate_drift_path_with_copernicus(
            start_latitude=payload.start_latitude,
            start_longitude=payload.start_longitude,
            when=payload.start_date,
            hours=payload.hours,
            step_hours=payload.step_hours,
            fallback_to_mock=payload.fallback_to_mock,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc


@app.post("/ais-gaps")
def ais_gaps_endpoint(payload: AISGapRequest) -> list[dict[str, Any]]:
    try:
        return get_ais_gaps(
            min_lat=payload.min_lat,
            max_lat=payload.max_lat,
            min_lon=payload.min_lon,
            max_lon=payload.max_lon,
            start_date=payload.start_date,
            end_date=payload.end_date,
            limit=payload.limit,
            use_mock=payload.use_mock,
        )
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc


@app.post("/reasoning-brief")
def reasoning_brief_endpoint(payload: ReasoningBriefRequest) -> dict[str, Any]:
    try:
        return build_reasoning_brief(
            min_lat=payload.min_lat,
            max_lat=payload.max_lat,
            min_lon=payload.min_lon,
            max_lon=payload.max_lon,
            start_date=payload.start_date,
            end_date=payload.end_date,
            limit=payload.limit,
            use_mock=payload.use_mock,
            use_foundry=payload.use_foundry,
        )
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc


@app.get("/drift-demo")
def drift_demo() -> dict[str, Any]:
    """Return a short seeded mock drift for quick local verification.

    This endpoint does not require credentials and is intended for quick
    smoke-testing the drift path pipeline. It uses the deterministic seeded
    mock currents for reproducibility.
    """
    from datetime import date

    demo = calculate_drift_path_with_copernicus(
        start_latitude=15.0,
        start_longitude=85.0,
        when=date(2026, 6, 1),
        hours=24.0,
        step_hours=6.0,
        fallback_to_mock=True,
    )

    return {"demo": True, "drift": demo}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
