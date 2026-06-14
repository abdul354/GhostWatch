"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Activity } from "lucide-react"
import AsciiArt from "@/components/ui/ascii-art"

export function Navbar() {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY

      // If we scroll down and we're not at the very top, hide the navbar
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false)
      } else {
        // If we scroll up, show it
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    // Add scroll event listener
    window.addEventListener("scroll", controlNavbar)

    // Cleanup function
    return () => {
      window.removeEventListener("scroll", controlNavbar)
    }
  }, [lastScrollY])

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 border-b border-white bg-black transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* Change h-25 to h-20 (80px) or h-16 (64px) to tighten the top area */}
<nav className="max-w-7xl mx-auto flex items-center justify-between h-20 px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex items-center justify-center text-white">
            <AsciiArt className="text-white text-[11px] leading-2.9 text-center" />
          </div>
          {/* Kept the alignment nudge from earlier! */}
          <span className="text-base font-bold text-white font-mono tracking-tight translate-y-[9px]">
            GHOSTWATCH
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="#reasoning"
            className="px-3 py-2 text-xs font-bold text-white transition-all border border-white hover:bg-white hover:text-black"
          >
            AGENT
          </Link>
          <Link
            href="#report"
            className="px-3 py-2 text-xs font-bold text-white transition-all border border-white hover:bg-white hover:text-black"
          >
            REPORT
          </Link>
          <Link
            href="#missions"
            className="px-3 py-2 text-xs font-bold text-white transition-all border border-white hover:bg-white hover:text-black"
          >
            MISSIONS
          </Link>
        </div>
      </nav>
    </header>
  )
}
