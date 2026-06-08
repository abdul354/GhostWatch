"use client"

import { motion } from "framer-motion"
import { ReportGhostGearForm } from "@/components/forms/report-ghost-gear-form"

export function ReportSection() {
  return (
    <section
      id="report"
      className="px-6 py-24 bg-black border-b border-white"
    >
      <div className="max-w-2xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 pb-8 border-b border-white"
        >
          <p className="text-sm font-medium text-neutral-400 uppercase tracking-wider mb-4 font-mono">
            Take Action
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Report Ghost Gear
          </h2>
          <p className="text-neutral-400 max-w-xl mx-auto text-balance text-sm font-mono">
            Spotted abandoned fishing equipment? Use this form to report its location
            and help our teams respond quickly to protect marine life.
          </p>
        </motion.div>

        {/* Form */}
        <ReportGhostGearForm />
      </div>
    </section>
  )
}
