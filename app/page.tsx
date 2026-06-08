import { Navbar } from "@/components/ui/navbar"
import { FeaturesSection } from "@/components/sections/features-section"
import { ReportSection } from "@/components/sections/report-section"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <FeaturesSection />
        <ReportSection />
      </div>
    </main>
  )
}
