"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface GearReportFormData {
  latitude: string
  longitude: string
  dateObserved: string
  description: string
}

export function GearReportForm() {
  const [formData, setFormData] = useState<GearReportFormData>({
    latitude: "",
    longitude: "",
    dateObserved: "",
    description: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target
    setFormData((previous) => ({ ...previous, [name]: value }))
  }

  const handleAcquireGpsLock = () => {
    // Placeholder action for the field utility control.
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    await new Promise((resolve) => setTimeout(resolve, 900))

    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const isFormValid =
    formData.latitude.trim().length > 0 &&
    formData.longitude.trim().length > 0 &&
    formData.dateObserved.trim().length > 0 &&
    formData.description.trim().length > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      className="w-full"
    >
      <div className="border border-neutral-800 bg-black rounded-none">
        <div className="border-b border-neutral-800 p-4 md:p-6 rounded-none">
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-white">
            [ INITIATE FIELD REPORT ]
          </p>
          <p className="mt-3 max-w-xl font-mono text-xs leading-6 text-neutral-400 uppercase tracking-wider">
            Field utility for coastal monitoring and abandoned fishing gear response.
          </p>
        </div>

        {isSubmitted ? (
          <div className="p-4 md:p-6 rounded-none">
            <div className="border border-neutral-800 bg-black p-4 md:p-5 rounded-none">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-white">
                TRANSMISSION ACCEPTED
              </p>
              <p className="mt-2 font-mono text-sm text-neutral-400">
                Field intelligence has been queued for review.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 p-4 md:p-6 rounded-none">
            <div className="space-y-3 rounded-none">
              <Button
                type="button"
                onClick={handleAcquireGpsLock}
                className="h-12 w-full rounded-none border border-neutral-800 bg-black px-4 font-mono text-xs uppercase tracking-[0.25em] text-white hover:bg-neutral-950"
              >
                📍 ACQUIRE GPS LOCK
              </Button>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-2 rounded-none">
                  <Label
                    htmlFor="latitude"
                    className="font-mono text-xs uppercase tracking-widest text-white"
                  >
                    Latitude
                  </Label>
                  <Input
                    id="latitude"
                    name="latitude"
                    type="number"
                    step="0.0001"
                    placeholder="14.2983"
                    value={formData.latitude}
                    onChange={handleChange}
                    className="h-12 rounded-none border border-neutral-800 bg-black font-mono text-white placeholder:text-neutral-600"
                    required
                  />
                </div>

                <div className="space-y-2 rounded-none">
                  <Label
                    htmlFor="longitude"
                    className="font-mono text-xs uppercase tracking-widest text-white"
                  >
                    Longitude
                  </Label>
                  <Input
                    id="longitude"
                    name="longitude"
                    type="number"
                    step="0.0001"
                    placeholder="-87.1921"
                    value={formData.longitude}
                    onChange={handleChange}
                    className="h-12 rounded-none border border-neutral-800 bg-black font-mono text-white placeholder:text-neutral-600"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="border border-neutral-800 bg-neutral-950 p-4 rounded-none">
              <div className="relative h-48 overflow-hidden rounded-none border border-neutral-800 bg-neutral-950">
                <div
                  className="absolute inset-0 opacity-35"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-10 w-10 border border-neutral-800 bg-black" />
                </div>
                <div className="absolute inset-x-0 bottom-0 border-t border-neutral-800 bg-black/80 p-3">
                  <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-neutral-400">
                    Leaflet Pin Staging Area
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-none">
              <div className="space-y-2 rounded-none">
                <Label
                  htmlFor="dateObserved"
                  className="font-mono text-xs uppercase tracking-widest text-white"
                >
                  Date Observed
                </Label>
                <Input
                  id="dateObserved"
                  name="dateObserved"
                  type="date"
                  value={formData.dateObserved}
                  onChange={handleChange}
                  className="h-12 rounded-none border border-neutral-800 bg-black font-mono text-white"
                  required
                />
              </div>

              <div className="space-y-2 rounded-none">
                <Label
                  htmlFor="description"
                  className="font-mono text-xs uppercase tracking-widest text-white"
                >
                  Visual Description / Vessel ID
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe the net, nearby vessel markings, debris profile, or other field intelligence."
                  value={formData.description}
                  onChange={handleChange}
                  className="min-h-32 rounded-none border border-neutral-800 bg-black font-mono text-white placeholder:text-neutral-600"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="h-14 w-full rounded-none bg-white px-4 font-mono text-xs uppercase tracking-[0.3em] text-black hover:bg-neutral-200 disabled:cursor-not-allowed disabled:bg-neutral-700 disabled:text-neutral-400"
            >
              {isSubmitting ? "TRANSMITTING..." : "TRANSMIT INTELLIGENCE"}
            </Button>
          </form>
        )}
      </div>
    </motion.div>
  )
}