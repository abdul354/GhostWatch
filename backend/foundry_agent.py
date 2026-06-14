from __future__ import annotations

import json
import os
from typing import Any
from urllib import error, request


def get_foundry_status() -> dict[str, Any]:
    """Return non-secret Azure AI Foundry integration status."""

    required = {
        "endpoint": os.getenv("AZURE_AI_FOUNDRY_ENDPOINT", "").strip(),
        "deployment": os.getenv("AZURE_AI_FOUNDRY_DEPLOYMENT", "").strip(),
        "api_version": os.getenv("AZURE_AI_FOUNDRY_API_VERSION", "").strip(),
        "api_key": os.getenv("AZURE_AI_FOUNDRY_API_KEY", "").strip(),
    }
    configured = all(required.values())

    return {
        "provider": "Azure AI Foundry",
        "state": "connected" if configured else "local-fallback",
        "configured": configured,
        "deployment": required["deployment"] or "not configured",
        "details": (
            "Foundry environment variables are configured."
            if configured
            else "Foundry integration is installed. Local fallback is active until endpoint, deployment, API version, and key are configured."
        ),
    }


def build_local_agent_plan(brief: dict[str, Any]) -> str:
    incidents = brief.get("incidents", [])
    if not incidents:
        return "No active intervention plan is required for this operating window."

    top = incidents[0]
    target = top["target"]["vessel_name"]
    priority = top["priority"]
    action = top["recommended_action"]
    signals = "; ".join(top["signals"])

    return (
        f"Prioritize {target} as a {priority} response. Evidence: {signals}. "
        f"Recommended next step: {action}"
    )


def generate_foundry_plan(brief: dict[str, Any]) -> dict[str, Any]:
    """Generate a response plan with Foundry when configured, otherwise fallback.

    This uses Azure OpenAI-compatible model deployments exposed through Azure AI
    Foundry. It intentionally avoids adding SDK dependencies so the project
    still runs cleanly without cloud credentials.
    """

    status = get_foundry_status()
    fallback_plan = build_local_agent_plan(brief)

    if not status["configured"]:
        return {
            "status": status,
            "source": "local deterministic fallback",
            "plan": fallback_plan,
        }

    endpoint = os.environ["AZURE_AI_FOUNDRY_ENDPOINT"].rstrip("/")
    deployment = os.environ["AZURE_AI_FOUNDRY_DEPLOYMENT"]
    api_version = os.environ["AZURE_AI_FOUNDRY_API_VERSION"]
    api_key = os.environ["AZURE_AI_FOUNDRY_API_KEY"]
    url = f"{endpoint}/openai/deployments/{deployment}/chat/completions?api-version={api_version}"

    payload = {
        "messages": [
            {
                "role": "system",
                "content": (
                    "You are GhostWatch, a marine conservation response agent. "
                    "Write concise, operational mission guidance from structured AIS, drift, and risk data."
                ),
            },
            {
                "role": "user",
                "content": json.dumps(
                    {
                        "summary": brief.get("summary"),
                        "operating_window": brief.get("operating_window"),
                        "incidents": brief.get("incidents", [])[:3],
                    }
                ),
            },
        ],
        "temperature": 0.2,
        "max_tokens": 220,
    }

    req = request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "api-key": api_key,
        },
        method="POST",
    )

    try:
        with request.urlopen(req, timeout=12) as response:
            data = json.loads(response.read().decode("utf-8"))
            plan = data["choices"][0]["message"]["content"].strip()
            return {
                "status": status,
                "source": "azure ai foundry",
                "plan": plan,
            }
    except (KeyError, TimeoutError, error.URLError, error.HTTPError, json.JSONDecodeError) as exc:
        return {
            "status": {
                **status,
                "state": "fallback",
                "details": f"Foundry call failed; local plan returned. {exc}",
            },
            "source": "local deterministic fallback",
            "plan": fallback_plan,
        }
