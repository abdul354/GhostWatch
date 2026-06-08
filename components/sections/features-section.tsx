"use client"

import { motion } from "framer-motion"
import { MissionBriefCard } from "@/components/cards/mission-brief-card"

const activeMissions = [
  {
    id: "GHOST-001",
    urgency: "High" as const,
    coordinates: { latitude: 14.2983, longitude: -87.1921 },
    species: "Sea Turtles",
    daysAdrift: 12,
    missionTitle: "Operation Leatherback",
    description: "Nesting site protection mission",
  },
  {
    id: "GHOST-002",
    urgency: "Medium" as const,
    coordinates: { latitude: 9.7489, longitude: -83.7534 },
    species: "Humpback Whales",
    daysAdrift: 5,
    missionTitle: "Whale Corridor Patrol",
    description: "Migration route monitoring",
  },
  {
    id: "GHOST-003",
    urgency: "Low" as const,
    coordinates: { latitude: 10.3910, longitude: -84.2731 },
    species: "Manatees",
    daysAdrift: 3,
    missionTitle: "Shallow Water Survey",
    description: "Habitat assessment and tracking",
  },
]

export function FeaturesSection() {
  return (
    <section id="missions" className="px-6 py-12 bg-black border-b border-white">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 pb-8 border-b border-white"
        >
          <p className="text-sm font-medium text-neutral-400 uppercase tracking-wider mb-8 font-mono">Active Operations</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 font-sans tracking-tight">
            Mission Brief Dashboard
          </h2>
          <p className="text-neutral-400 max-w-2xl mx-auto text-balance font-mono text-sm">
            Real-time tactical intelligence for marine conservation operations. Monitor critical missions with AI-powered insights.
          </p>
        </motion.div>

        {/* Mission Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activeMissions.map((mission, index) => (
            <MissionBriefCard key={mission.id} {...mission} delay={index * 0.1} />
          ))}
        </div>
      </div>
    </section>
  )
}
