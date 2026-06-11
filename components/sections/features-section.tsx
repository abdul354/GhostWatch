"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { MissionBriefCard } from "@/components/cards/mission-brief-card"
import { Button } from "@/components/ui/button"

interface AISGapRecord {
  vessel_id: string
  vessel_name: string
  vessel_flag: string
  gap_start_lat: number
  gap_start_lon: number
  gap_start_date: string
  gap_duration_hours: number
  vessel_type: string
}

const API_URL = "http://127.0.0.1:8000/ais-gaps"

const REQUEST_BODY = {
  min_lat: 10.0,
  max_lat: 20.0,
  min_lon: 80.0,
  max_lon: 90.0,
  start_date: "2026-05-01",
  end_date: "2026-06-07",
}

const FALLBACK_MISSIONS: AISGapRecord[] = [
  {
    vessel_id: "98765",
    vessel_name: "ROGUE_ONE",
    vessel_flag: "PAN",
    gap_start_lat: 15.4,
    gap_start_lon: 85.1,
    gap_start_date: "2026-05-15",
    gap_duration_hours: 36,
    vessel_type: "fishing",
  },
  {
    vessel_id: "40219",
    vessel_name: "DEEP_SIGNAL",
    vessel_flag: "LBR",
    gap_start_lat: 13.8721,
    gap_start_lon: 88.0123,
    gap_start_date: "2026-05-28",
    gap_duration_hours: 14,
    vessel_type: "tanker",
  },
  {
    vessel_id: "66103",
    vessel_name: "NIGHT_CURRENT",
    vessel_flag: "VUT",
    gap_start_lat: 18.2245,
    gap_start_lon: 82.7734,
    gap_start_date: "2026-06-03",
    gap_duration_hours: 7,
    vessel_type: "cargo",
  },
]

function getUrgency(gapDurationHours: number): "High" | "Medium" | "Low" {
  if (gapDurationHours > 24) {
    return "High"
  }

  if (gapDurationHours > 6) {
    return "Medium"
  }

  return "Low"
}

function formatDaysAdrift(gapDurationHours: number) {
  return Number((gapDurationHours / 24).toFixed(1))
}

export function FeaturesSection() {
  const [data, setData] = useState<AISGapRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function loadAISGaps() {
      setLoading(true)
      setError(null)

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
          throw new Error(`Backend request failed with status ${response.status}`)
        }

        const payload = (await response.json()) as AISGapRecord[]
        setData(Array.isArray(payload) ? payload : [])
      } catch (error) {
        if ((error as Error).name === "AbortError") {
          return
        }

        setData(FALLBACK_MISSIONS)
        setError(
          error instanceof Error
            ? `Backend offline, showing tactical mock data. ${error.message}`
            : "Backend offline, showing tactical mock data."
        )
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    void loadAISGaps()

    return () => controller.abort()
  }, [refreshKey])

  const missions = data.map((record) => {
    const urgency = getUrgency(record.gap_duration_hours)

    return {
      id: `${record.vessel_name} / ${record.vessel_flag}`,
      urgency,
      coordinates: {
        latitude: record.gap_start_lat,
        longitude: record.gap_start_lon,
      },
      species: `${record.vessel_type} | ${record.vessel_flag}`,
      daysAdrift: formatDaysAdrift(record.gap_duration_hours),
      missionTitle: record.vessel_name,
      description: `Target ID ${record.vessel_id} • AIS gap started ${record.gap_start_date} • ${record.gap_duration_hours}h silence`,
    }
  })

  return (
    <section id="missions" className="px-6 py-12 bg-black border-b border-neutral-800">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 pb-8 border-b border-neutral-800"
        >
          <p className="text-sm font-medium text-neutral-400 uppercase tracking-wider mb-8 font-mono">AIS Gap Operations</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 font-sans tracking-tight">
            Mission Brief Dashboard
          </h2>
          <p className="text-neutral-400 max-w-2xl mx-auto text-balance font-mono text-sm">
            Real-time tactical intelligence for marine conservation operations. Live AIS gap detections are fetched directly from the local backend.
          </p>
        </motion.div>

        {loading ? (
          <div className="border border-neutral-800 bg-black p-6 md:p-8 text-center">
            <p className="font-mono text-sm uppercase tracking-[0.35em] text-white animate-pulse">
              [ ESTABLISHING SAT-LINK... ]
            </p>
            <p className="mt-3 font-mono text-xs uppercase tracking-widest text-neutral-500">
              POST {API_URL}
            </p>
          </div>
        ) : missions.length === 0 ? (
          <div className="border border-neutral-800 bg-black p-6 md:p-8 text-center">
            <p className="font-mono text-sm uppercase tracking-widest text-white">
              [ NO ACTIVE AIS GAPS DETECTED ]
            </p>
            <p className="mt-3 font-mono text-xs uppercase tracking-widest text-neutral-500">
              The backend returned an empty tactical picture for the selected window.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {error ? (
              <div className="border border-neutral-800 bg-black p-4 md:p-5">
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-red-500 mb-2">
                  [ BACKEND OFFLINE - MOCK FEED ACTIVE ]
                </p>
                <p className="font-mono text-xs text-neutral-400">
                  {error}
                </p>
              </div>
            ) : null}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {missions.map((mission, index) => (
                <MissionBriefCard key={mission.id} {...mission} delay={index * 0.1} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
