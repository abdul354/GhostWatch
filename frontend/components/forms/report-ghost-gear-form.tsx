"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MapPin, Calendar, MessageSquare, Send, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface ReportFormData {
  latitude: string
  longitude: string
  dateObserved: string
  description: string
}

export function ReportGhostGearForm() {
  const [formData, setFormData] = useState<ReportFormData>({
    latitude: "",
    longitude: "",
    dateObserved: "",
    description: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setSubmitted(true)
    setIsSubmitting(false)

    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({
        latitude: "",
        longitude: "",
        dateObserved: "",
        description: "",
      })
      setSubmitted(false)
    }, 3000)
  }

  const isFormValid =
    formData.latitude &&
    formData.longitude &&
    formData.dateObserved &&
    formData.description

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="border border-white bg-black">
        <div className="p-6 md:p-8">
          {/* Form Header */}
          <div className="mb-8 pb-4 border-b border-white">
            <div className="flex items-start gap-3 mb-4">
              <div className="mt-1 p-2 border border-red-600">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-white uppercase tracking-tight">
                  Report Ghost Gear
                </h3>
                <p className="text-xs md:text-sm text-neutral-400 mt-1 font-mono">
                  Help us protect marine life by reporting abandoned fishing equipment
                </p>
              </div>
            </div>
          </div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5 }}
                className="w-16 h-16 mx-auto mb-4 border-2 border-white flex items-center justify-center"
              >
                <div className="w-12 h-12 bg-white flex items-center justify-center">
                  <Send className="w-6 h-6 text-black" />
                </div>
              </motion.div>
              <h4 className="text-lg font-bold text-white mb-2 uppercase tracking-tight">
                Report Submitted
              </h4>
              <p className="text-xs md:text-sm text-neutral-400 font-mono">
                Thank you for helping protect our oceans. Our team is reviewing your report.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Location Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white">
                  <MapPin className="w-4 h-4 text-white" />
                  <label className="text-xs font-bold text-white uppercase tracking-widest">
                    Location
                  </label>
                </div>

                {/* Map Placeholder with Grid Pattern */}
                <div className="w-full h-48 md:h-56 bg-black border-2 border-white flex items-center justify-center mb-4 relative overflow-hidden">
                  {/* Grid pattern background */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="w-full h-full" style={{
                      backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.1) 26%, transparent 27%, transparent 74%, rgba(255,255,255,0.1) 75%, rgba(255,255,255,0.1) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.1) 26%, transparent 27%, transparent 74%, rgba(255,255,255,0.1) 75%, rgba(255,255,255,0.1) 76%, transparent 77%, transparent)',
                      backgroundSize: '50px 50px'
                    }} />
                  </div>
                  {/* Crosshairs */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-0.5 bg-white" />
                    <div className="w-0.5 h-8 bg-white absolute" />
                  </div>
                  <div className="relative text-center">
                    <p className="text-xs text-neutral-400 font-mono">
                      Tactical Data Feed
                    </p>
                    <p className="text-xs text-neutral-400/60 font-mono">
                      Enter coordinates below
                    </p>
                  </div>
                </div>

                {/* Latitude & Longitude Inputs */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="latitude" className="text-xs md:text-sm mb-2 font-mono uppercase text-white">
                      Lat
                    </Label>
                    <Input
                      id="latitude"
                      name="latitude"
                      type="number"
                      step="0.0001"
                      placeholder="e.g., 14.2983"
                      value={formData.latitude}
                      onChange={handleChange}
                      className="h-12 md:h-14 text-base md:text-lg font-mono border-0 border-b-2 border-white bg-black text-white placeholder:text-neutral-600"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="longitude" className="text-xs md:text-sm mb-2 font-mono uppercase text-white">
                      Lon
                    </Label>
                    <Input
                      id="longitude"
                      name="longitude"
                      type="number"
                      step="0.0001"
                      placeholder="e.g., -87.1921"
                      value={formData.longitude}
                      onChange={handleChange}
                      className="h-12 md:h-14 text-base md:text-lg font-mono border-0 border-b-2 border-white bg-black text-white placeholder:text-neutral-600"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Date Section */}
              <div className="space-y-2 pt-4 border-t border-white">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-4 h-4 text-white" />
                  <Label htmlFor="dateObserved" className="text-xs font-bold text-white uppercase tracking-widest">
                    Date Observed
                  </Label>
                </div>
                <Input
                  id="dateObserved"
                  name="dateObserved"
                  type="date"
                  value={formData.dateObserved}
                  onChange={handleChange}
                  className="h-12 md:h-14 text-base md:text-lg font-mono border-0 border-b-2 border-white bg-black text-white"
                  required
                />
              </div>

              {/* Description Section */}
              <div className="space-y-2 pt-4 border-t border-white">
                <div className="flex items-center gap-2 pb-2 mb-4 border-b border-white">
                  <MessageSquare className="w-4 h-4 text-white" />
                  <Label htmlFor="description" className="text-xs font-bold text-white uppercase tracking-widest">
                    Description
                  </Label>
                </div>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe the ghost gear: type of equipment, estimated size, condition, marine life at risk, etc."
                  value={formData.description}
                  onChange={handleChange}
                  className="min-h-32 md:min-h-40 text-base md:text-lg p-3 font-mono border-2 border-white bg-black text-white placeholder:text-neutral-600"
                  required
                />
                <p className="text-xs text-neutral-400 font-mono">
                  {formData.description.length}/500 characters
                </p>
              </div>

              {/* Submit Button */}
              <motion.div
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
                className="pt-4"
              >
                <Button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className="w-full h-14 md:h-16 text-xs md:text-sm font-bold gap-3 bg-red-600 hover:bg-red-700 text-white transition-all duration-300 uppercase tracking-wider border-0"
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Number.POSITIVE_INFINITY,
                        }}
                      >
                        <Send className="w-5 h-5" />
                      </motion.div>
                      Submitting Report...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Submit Report
                    </>
                  )}
                </Button>
              </motion.div>

              {/* Helper Text */}
              <p className="text-xs md:text-sm text-neutral-400 text-center font-mono">
                Your report helps us locate and remove ghost gear to protect marine ecosystems.
              </p>
            </form>
          )}
        </div>
      </div>
    </motion.div>
  )
}
