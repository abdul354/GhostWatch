"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { AlertCircle, MapPin, Clock, Send } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface MissionBriefCardProps {
  id: string
  urgency: "High" | "Medium" | "Low"
  coordinates: {
    latitude: number
    longitude: number
  }
  species: string
  daysAdrift: number
  missionTitle: string
  description?: string
  delay?: number
}

const fetchIQSpeciesData = async (lat: number, lon: number) => {
  try {
    const response = await fetch(
      `https://api.obis.org/v3/occurrence?lat=${lat}&lon=${lon}&radius=50000&redlist=true&size=3`
    )

    if (!response.ok) return ["Unknown Species"]

    const data = await response.json()

    if (data.results && data.results.length > 0) {
      return data.results
        .map((record: { species?: string; scientificName?: string }) => record.species || record.scientificName)
        .filter(Boolean)
    }

    return ["General Marine Wildlife"]
  } catch (error) {
    console.error("Web IQ (OBIS) Fetch Failed:", error)
    return ["Data unavailable"]
  }
}

export function MissionBriefCard({
  id,
  urgency,
  coordinates,
  species,
  daysAdrift,
  missionTitle,
  description,
  delay = 0,
}: MissionBriefCardProps) {
  const [atRiskSpecies, setAtRiskSpecies] = useState("QUERYING OBIS DB...")

  const urgencyConfig = {
    High: { color: "border border-neutral-800 bg-transparent text-red-500", label: "HIGH" },
    Medium: { color: "border border-neutral-800 bg-transparent text-white", label: "ACTIVE" },
    Low: { color: "border border-neutral-800 bg-transparent text-neutral-400", label: "MONITOR" },
  }

  const config = urgencyConfig[urgency]

  useEffect(() => {
    let isMounted = true

    const runIQLookup = async () => {
      const speciesList = await fetchIQSpeciesData(coordinates.latitude, coordinates.longitude)
      if (isMounted) {
        setAtRiskSpecies(speciesList[0] ?? "Data unavailable")
      }
    }

    void runIQLookup()

    return () => {
      isMounted = false
    }
  }, [coordinates.latitude, coordinates.longitude])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="group h-full overflow-hidden border border-neutral-800 bg-transparent hover:border-neutral-700 transition-all duration-300">
        <div className="p-6 flex flex-col h-full">
          {/* Header with Urgency Badge */}
          <div className="flex items-start justify-between mb-4 pb-3 border-b border-neutral-800">
            <div className="flex-1">
              <h3 className="font-bold text-white text-sm leading-tight mb-1 uppercase tracking-tight">{missionTitle}</h3>
              {description && <p className="text-neutral-400 text-xs font-mono">{description}</p>}
            </div>
            <motion.div
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: delay + 0.1 }}
            >
              <Badge className={`${config.color} font-mono text-xs px-2 py-0.5 flex items-center gap-1 ml-3 whitespace-nowrap border-0`}>
                <AlertCircle className="w-3 h-3" />
                {config.label}
              </Badge>
            </motion.div>
          </div>

          {/* Mission ID */}
          <div className="mb-4 pb-3 border-b border-neutral-800">
            <p className="text-xs text-neutral-400 font-mono tracking-wide">TARGET ID: <span className="font-bold text-white">{id}</span></p>
          </div>

          {/* GPS Coordinates Section */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-white" />
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">GPS Coordinates</p>
            </div>
            <div className="bg-transparent border border-neutral-800 p-3">
              <div className="grid grid-cols-2 gap-3">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: delay + 0.2 }}
                >
                  <p className="text-xs text-neutral-400 mb-1 font-mono uppercase">Lat</p>
                  <p className="font-mono text-sm font-bold text-white">
                    {coordinates.latitude.toFixed(4)}
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: delay + 0.25 }}
                >
                  <p className="text-xs text-neutral-400 mb-1 font-mono uppercase">Lon</p>
                  <p className="font-mono text-sm font-bold text-white">
                    {coordinates.longitude.toFixed(4)}
                  </p>
                </motion.div>
              </div>
            </div>
          </div>

          {/* IQ Intelligence Section */}
          <motion.div
            className="mb-4 relative left-1 top-1 bg-black border border-neutral-800 border-t-neutral-600 p-3"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: delay + 0.3 }}
          >
            <p className="text-xs font-bold text-white uppercase tracking-[0.35em] mb-3">
              [ IQ ALIGN: OBIS BIODIVERSITY DB ]
            </p>
            <div className="flex items-center gap-2 text-xs font-mono tracking-[0.2em] uppercase text-neutral-400">
              <span className="text-white">&gt;</span>
              <span>
                Species at Risk: <span className="text-white">{atRiskSpecies}</span>
              </span>
            </div>
          </motion.div>

          {/* Days Adrift Counter */}
          <motion.div
            className="mb-4 bg-transparent border border-neutral-800 p-3"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: delay + 0.35 }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-white" />
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Gap Duration</p>
            </div>
            <motion.p
              className="font-mono text-2xl font-bold text-white"
              animate={daysAdrift > 7 ? { scale: [1, 1.05, 1] } : {}}
              transition={daysAdrift > 7 ? { duration: 1.5, repeat: Number.POSITIVE_INFINITY } : {}}
            >
              {daysAdrift}
            </motion.p>
            <p className="mt-1 text-xs font-mono text-neutral-500 uppercase tracking-widest">Days</p>
          </motion.div>

          {/* Dispatch Crew Button */}
          <motion.div
            className="mt-auto pt-3"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: delay + 0.4 }}
          >
            <Button
              className="w-full bg-black hover:bg-neutral-950 text-white font-bold uppercase text-xs tracking-wider border border-neutral-800"
              size="lg"
            >
              <Send className="w-4 h-4 mr-2" />
              Dispatch Crew
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
