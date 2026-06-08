"use client"

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
  const urgencyConfig = {
    High: { color: "bg-destructive text-destructive-foreground", label: "CRITICAL" },
    Medium: { color: "border-2 border-white bg-transparent text-white", label: "ACTIVE" },
    Low: { color: "border border-neutral-400 bg-transparent text-neutral-400", label: "MONITOR" },
  }

  const config = urgencyConfig[urgency]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="group h-full overflow-hidden border border-white bg-transparent hover:border-neutral-400 transition-all duration-300">
        <div className="p-6 flex flex-col h-full">
          {/* Header with Urgency Badge */}
          <div className="flex items-start justify-between mb-4 pb-3 border-b border-white">
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
          <div className="mb-4 pb-3 border-b border-white">
            <p className="text-xs text-neutral-400 font-mono tracking-wide">MISSION ID: <span className="font-bold text-white">{id}</span></p>
          </div>

          {/* GPS Coordinates Section */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-white" />
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">GPS Coordinates</p>
            </div>
            <div className="bg-transparent border border-white p-3">
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
            className="mb-4 bg-transparent border border-white p-3"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: delay + 0.3 }}
          >
            <p className="text-xs font-bold text-white uppercase tracking-widest mb-2">IQ Intelligence</p>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-white" />
              <p className="text-xs font-mono text-neutral-400">Species at Risk: <span className="text-white">{species}</span></p>
            </div>
          </motion.div>

          {/* Days Adrift Counter */}
          <motion.div
            className="mb-4 bg-transparent border border-white p-3"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: delay + 0.35 }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-white" />
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Days Adrift</p>
            </div>
            <motion.p
              className="font-mono text-2xl font-bold text-white"
              animate={daysAdrift > 7 ? { scale: [1, 1.05, 1] } : {}}
              transition={daysAdrift > 7 ? { duration: 1.5, repeat: Number.POSITIVE_INFINITY } : {}}
            >
              {daysAdrift}
            </motion.p>
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
              className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold uppercase text-xs tracking-wider border-0"
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
