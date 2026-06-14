"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { BrainCircuit, Radar, Route, ShieldAlert } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface IncidentBrief {
  rank: number
  priority: "critical" | "high" | "medium" | "low"
  risk_score: number
  target: {
    vessel_id: string
    vessel_name: string
    vessel_flag: string
    vessel_type: string
  }
  location: {
    latitude: number
    longitude: number
  }
  signals: string[]
  drift: {
    end: {
      latitude: number
      longitude: number
    }
    displacement_km: number
  }
  recommended_action: string
}

interface ReasoningBrief {
  agent: string
  mode: string
  summary: string
  incidents: IncidentBrief[]
  api_notes: string[]
  foundry?: {
    status: {
      provider: string
      state: string
      configured: boolean
      deployment: string
      details: string
    }
    source: string
    plan: string
  }
}

const API_URL = "http://127.0.0.1:8000/reasoning-brief"

const REQUEST_BODY = {
  min_lat: 10.0,
  max_lat: 20.0,
  min_lon: 80.0,
  max_lon: 90.0,
  start_date: "2026-05-01",
  end_date: "2026-06-07",
  limit: 3,
  use_mock: true,
  use_foundry: true,
}

const FALLBACK_BRIEF: ReasoningBrief = {
  agent: "GhostWatch Reasoning Agent",
  mode: "local fallback",
  summary:
    "Sea Lantern is the top intervention target because it combines extended AIS silence with protected-corridor risk.",
  incidents: [
    {
      rank: 1,
      priority: "critical",
      risk_score: 0.94,
      target: {
        vessel_id: "636092018",
        vessel_name: "Sea Lantern",
        vessel_flag: "PAN",
        vessel_type: "Cargo",
      },
      location: {
        latitude: 14.3821,
        longitude: 87.2144,
      },
      signals: [
        "AIS silence lasted 18.4 hours",
        "Projected drift displacement is 13.2 km",
        "AIS silence inside protected corridor",
      ],
      drift: {
        end: {
          latitude: 14.3312,
          longitude: 87.2462,
        },
        displacement_km: 13.2,
      },
      recommended_action:
        "Dispatch recovery crew and request vessel identity review.",
    },
  ],
  api_notes: [
    "Backend offline: showing deterministic fallback brief.",
    "Connect Azure AI Foundry after the structured reasoning contract is stable.",
  ],
  foundry: {
    status: {
      provider: "Azure AI Foundry",
      state: "handoff-ready",
      configured: false,
      deployment: "not configured",
      details: "No Foundry key is required for local demo mode.",
    },
    source: "local deterministic fallback",
    plan: "Prioritize Sea Lantern as a critical response. Recommended next step: dispatch recovery crew and request vessel identity review.",
  },
}

function priorityClass(priority: IncidentBrief["priority"]) {
  if (priority === "critical") {
    return "border-red-600 text-red-500"
  }

  if (priority === "high") {
    return "border-white text-white"
  }

  return "border-neutral-700 text-neutral-400"
}

export function ReasoningSection() {
  const [brief, setBrief] = useState<ReasoningBrief | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function loadBrief() {
      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(REQUEST_BODY),
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`Reasoning API returned ${response.status}`)
        }

        setBrief((await response.json()) as ReasoningBrief)
      } catch (error) {
        if ((error as Error).name === "AbortError") {
          return
        }

        setBrief(FALLBACK_BRIEF)
        setError(
          error instanceof Error
            ? `Reasoning API offline. ${error.message}`
            : "Reasoning API offline."
        )
      }
    }

    void loadBrief()

    return () => controller.abort()
  }, [])

  const primaryIncident = brief?.incidents[0]

  return (
    <section id="reasoning" className="border-b border-neutral-800 bg-black px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 border-b border-neutral-800 pb-8"
        >
          <div className="mb-5 flex items-center gap-3">
            <BrainCircuit className="h-5 w-5 text-white" />
            <p className="font-mono text-sm uppercase tracking-[0.35em] text-neutral-400">
              Reasoning Agent
            </p>
          </div>
          <h2 className="mb-5 text-4xl font-bold tracking-tight text-white md:text-5xl">
            Incident Priority Brief
          </h2>
          <p className="max-w-3xl font-mono text-sm leading-7 text-neutral-400">
            {brief?.summary ?? "Compiling AIS gaps, drift projection, and response priority."}
          </p>
        </motion.div>

        {error ? (
          <div className="mb-6 border border-neutral-800 p-4">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-red-500">
              [ LOCAL FALLBACK ACTIVE ]
            </p>
            <p className="mt-2 font-mono text-xs text-neutral-400">{error}</p>
          </div>
        ) : null}

        {!brief || !primaryIncident ? (
          <div className="border border-neutral-800 p-6 text-center">
            <p className="font-mono text-sm uppercase tracking-[0.35em] text-white">
              [ REASONING PASS IN PROGRESS ]
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="border border-neutral-800 p-5 md:p-6">
              <div className="mb-5 flex flex-wrap items-start justify-between gap-4 border-b border-neutral-800 pb-5">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.3em] text-neutral-500">
                    Rank {primaryIncident.rank} Target
                  </p>
                  <h3 className="mt-2 text-2xl font-bold uppercase text-white">
                    {primaryIncident.target.vessel_name}
                  </h3>
                  <p className="mt-2 font-mono text-xs uppercase tracking-widest text-neutral-400">
                    {primaryIncident.target.vessel_id} / {primaryIncident.target.vessel_flag} /{" "}
                    {primaryIncident.target.vessel_type}
                  </p>
                </div>
                <Badge
                  className={`rounded-none border bg-black px-3 py-1 font-mono text-xs uppercase tracking-widest ${priorityClass(
                    primaryIncident.priority
                  )}`}
                >
                  {primaryIncident.priority} / {primaryIncident.risk_score}
                </Badge>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="border border-neutral-800 p-4">
                  <Radar className="mb-3 h-4 w-4 text-white" />
                  <p className="font-mono text-xs uppercase tracking-widest text-neutral-500">
                    Last Gap
                  </p>
                  <p className="mt-2 font-mono text-sm text-white">
                    {primaryIncident.location.latitude.toFixed(4)},{" "}
                    {primaryIncident.location.longitude.toFixed(4)}
                  </p>
                </div>
                <div className="border border-neutral-800 p-4">
                  <Route className="mb-3 h-4 w-4 text-white" />
                  <p className="font-mono text-xs uppercase tracking-widest text-neutral-500">
                    Drift End
                  </p>
                  <p className="mt-2 font-mono text-sm text-white">
                    {primaryIncident.drift.end.latitude.toFixed(4)},{" "}
                    {primaryIncident.drift.end.longitude.toFixed(4)}
                  </p>
                </div>
                <div className="border border-neutral-800 p-4">
                  <ShieldAlert className="mb-3 h-4 w-4 text-red-500" />
                  <p className="font-mono text-xs uppercase tracking-widest text-neutral-500">
                    Action
                  </p>
                  <p className="mt-2 font-mono text-sm text-white">
                    {primaryIncident.recommended_action}
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-neutral-800 p-5 md:p-6">
              <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-white">
                Reasoning Chain
              </p>
              <div className="space-y-3">
                {primaryIncident.signals.map((signal) => (
                  <div key={signal} className="border border-neutral-800 p-3">
                    <p className="font-mono text-xs leading-6 text-neutral-300">{signal}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 border-t border-neutral-800 pt-4">
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-neutral-500">
                  Foundry Agent
                </p>
                <p className="mt-2 font-mono text-sm text-white">
                  {brief.foundry?.status.provider ?? "Azure AI Foundry"} /{" "}
                  {brief.foundry?.status.state ?? brief.mode}
                </p>
                <p className="mt-3 font-mono text-xs leading-6 text-neutral-400">
                  {brief.foundry?.plan ??
                    "Structured brief is ready for Azure AI Foundry planning."}
                </p>
                <p className="mt-3 font-mono text-[11px] uppercase tracking-widest text-neutral-600">
                  Source: {brief.foundry?.source ?? "structured reasoning brief"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
