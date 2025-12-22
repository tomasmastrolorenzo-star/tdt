import SmartGrowthConsultant from "@/components/trend-up/smart-growth-consultant"
import TrendUpFooter from "@/components/trend-up/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#02040a] terminal-scanlines flex flex-col justify-center relative">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        {/* EL FARO V6: THE ONLY INSTRUMENT */}
        <div id="consultant" className="max-w-4xl mx-auto">
          <SmartGrowthConsultant />
        </div>
      </div>

      {/* Minimal Bureau Footer */}
      <div className="mt-auto py-10 opacity-30 hover:opacity-100 transition-opacity">
        <TrendUpFooter />
      </div>
    </main>
  )
}
